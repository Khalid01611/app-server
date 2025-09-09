import { Request, Response } from "express";
import Invoice from "../../models/Invoice";
import Product from "../../models/Product";
import User from "../../models/Users";

const subDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};

export const getDashboardStats = async (req: Request, res: Response): Promise<Response | any> => {
  try {
    const { period = "30", startDate, endDate } = req.query;

    let query: any = {};
    let dateFilter: any = {};

    if (startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate.toString()),
        $lte: new Date(endDate.toString() + 'T23:59:59.999Z')
      };
    } else {
      const days = parseInt(period.toString());
      const endDate = new Date();
      const startDate = subDays(endDate, days);
      
      dateFilter = {
        $gte: startDate,
        $lte: endDate
      };
    }

    query.date_time = dateFilter;

    const invoices = await Invoice.find(query)
      .populate([
        { path: 'product', select: 'name purchases sell' },
        { path: 'seller', select: 'name email' }
      ])
      .lean();

    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0);
    const totalQuantity = invoices.reduce((sum, invoice) => sum + invoice.quantity, 0);
    
    const totalProfit = invoices.reduce((sum, invoice) => {
      const product = invoice.product as any;
      if (product && product.purchases && product.sell) {
        const profitPerUnit = product.sell - product.purchases;
        return sum + (profitPerUnit * invoice.quantity);
      }
      return sum;
    }, 0);

    const averageOrderValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;
    const totalUsers = await User.countDocuments({ status: true });
    const totalProducts = await Product.countDocuments({ status: true });

    const productStats = new Map();
    invoices.forEach(invoice => {
      const product = invoice.product as any;
      if (product) {
        const productName = product.name;
        if (!productStats.has(productName)) {
          productStats.set(productName, { 
            product: productName, 
            quantity: 0, 
            revenue: 0,
            profit: 0 
          });
        }
        const stats = productStats.get(productName);
        stats.quantity += invoice.quantity;
        stats.revenue += invoice.total_amount;
        
        if (product.purchases && product.sell) {
          const profitPerUnit = product.sell - product.purchases;
          stats.profit += (profitPerUnit * invoice.quantity);
        }
      }
    });

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const paymentMethodStats = new Map();
    invoices.forEach(invoice => {
      const method = invoice.payment_method;
      if (!paymentMethodStats.has(method)) {
        paymentMethodStats.set(method, { method, count: 0, amount: 0 });
      }
      const stats = paymentMethodStats.get(method);
      stats.count += 1;
      stats.amount += invoice.total_amount;
    });

    const paymentMethodStatsArray = Array.from(paymentMethodStats.values())
      .sort((a, b) => b.amount - a.amount);

    const dailyStats = new Map();
    invoices.forEach(invoice => {
      const date = new Date(invoice.date_time).toISOString().split('T')[0];
      if (!dailyStats.has(date)) {
        dailyStats.set(date, { 
          date, 
          invoices: 0, 
          revenue: 0, 
          profit: 0,
          quantity: 0 
        });
      }
      const stats = dailyStats.get(date);
      stats.invoices += 1;
      stats.revenue += invoice.total_amount;
      stats.quantity += invoice.quantity;
      
      const product = invoice.product as any;
      if (product && product.purchases && product.sell) {
        const profitPerUnit = product.sell - product.purchases;
        stats.profit += (profitPerUnit * invoice.quantity);
      }
    });

    const dailyStatsArray = Array.from(dailyStats.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const sellerStats = new Map();
    invoices.forEach(invoice => {
      const seller = invoice.seller as any;
      if (seller) {
        const sellerName = seller.name;
        if (!sellerStats.has(sellerName)) {
          sellerStats.set(sellerName, { 
            seller: sellerName, 
            invoices: 0, 
            revenue: 0,
            quantity: 0 
          });
        }
        const stats = sellerStats.get(sellerName);
        stats.invoices += 1;
        stats.revenue += invoice.total_amount;
        stats.quantity += invoice.quantity;
      }
    });

    const topSellers = Array.from(sellerStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const recentInvoices = await Invoice.find(query)
      .populate([
        { path: 'product', select: 'name' },
        { path: 'seller', select: 'name' }
      ])
      .sort({ date_time: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      status: true,
      message: "Dashboard statistics retrieved successfully",
      data: {
        overview: {
          totalInvoices,
          totalRevenue,
          totalProfit,
          totalQuantity,
          totalUsers,
          totalProducts,
          averageOrderValue
        },
        topProducts,
        topSellers,
        paymentMethodStats: paymentMethodStatsArray,
        dailyStats: dailyStatsArray,
        recentInvoices
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      status: false,
      message: "HTTP 500 Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
};