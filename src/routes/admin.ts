import { Router } from "express";
import { siteUpload } from "../app/middlewares/multerMiddleware";
import {
  createUser,
  deleteUsers,
  getAllRolesForUser,
  getAllUsers,
  updateUser,
  updateUserStatus,
  updateUserVerification,
} from "../app/controllers/Admin/users.controller";
import {
  createProduct,
  deleteProducts,
  getAllProducts,
  updateProduct,
  updateProductStatus,
} from "../app/controllers/Invoice/product.controller";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoices,
  exportInvoices,
  getCustomerByVehicle,
} from "../app/controllers/Invoice/invoice.controller";
import {
  getReportStats,
  getDetailedReport,
  exportReport,
  getProductPerformanceReport,
  getCustomerAnalysisReport,
} from "../app/controllers/Admin/report.controller";
import {
  getDashboardStats,
} from "../app/controllers/Admin/dashboard.controller";
import {
  createOrUpdateSMSTemplate,
  getAllSMSTemplates,
  getSMSTemplateById,
  getLatestActiveSMSTemplate,
  toggleTemplateStatus,
  deleteSMSTemplate,
  bulkUpdateTemplates,
  createOrUpdateInvoiceSettings,
  getInvoiceSettings,
  createOrUpdateSiteSettings,
  getSiteSettings,
} from "../app/controllers/Admin/settings.controller";

const route = Router();

// Users
route.get("/get/roles-for-user", getAllRolesForUser);
route.get("/get/users", getAllUsers);
route.post("/create/user", createUser);
route.put("/update/user/:id", updateUser);
route.put("/update/status/user/:id", updateUserStatus);
route.put("/update/verified-at/user/:id", updateUserVerification);
route.post("/delete/users", deleteUsers);

// Products
route.get("/get/products", getAllProducts);
route.post("/create/product", createProduct);
route.put("/update/product/:id", updateProduct);
route.put("/update/product-status/:id", updateProductStatus);
route.post("/delete/products", deleteProducts);

// Invoices
route.get("/get/invoices", getAllInvoices);
route.get("/get/invoice/:id", getInvoiceById);
route.get("/get/customer-by-vehicle/:vehicle_no", getCustomerByVehicle);
route.post("/create/invoice", createInvoice);
route.put("/update/invoice/:id", updateInvoice);
route.post("/delete/invoices", deleteInvoices);
route.get("/export/invoices", exportInvoices);

// Reports
route.get("/reports/stats", getReportStats);
route.get("/reports/detailed", getDetailedReport);
route.get("/reports/export", exportReport);
route.get("/reports/product-performance", getProductPerformanceReport);
route.get("/reports/customer-analysis", getCustomerAnalysisReport);

// Dashboard
route.get("/dashboard/stats", getDashboardStats);

// SMS Settings
route.post("/sms-template", createOrUpdateSMSTemplate);
route.get("/sms-templates", getAllSMSTemplates);
route.get("/sms-template/:id", getSMSTemplateById);
route.get("/sms-template-latest/active", getLatestActiveSMSTemplate);
route.put("/sms-template/:id/toggle-status", toggleTemplateStatus);
route.delete("/sms-template/:id", deleteSMSTemplate);
route.put("/sms-templates/bulk-update", bulkUpdateTemplates);

// Invoice Settings
route.post("/invoice-settings", createOrUpdateInvoiceSettings);
route.get("/invoice-settings", getInvoiceSettings);

// Site Settings
route.post("/site-settings", siteUpload.single('logo'), createOrUpdateSiteSettings);
route.get("/site-settings", getSiteSettings);

export default route;
