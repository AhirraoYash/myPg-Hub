import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

//   Route Imports ──────────────────────────────────────────────────────────
import loginRouter         from './routes/auth/login';
import registerRouter      from './routes/auth/register';
import meRouter            from './routes/auth/me';
import tenantsRouter       from './routes/tenants/index';
import tenantOnboardRouter from './routes/tenants/onboard';
import tenantByIdRouter    from './routes/tenants/[id]';
import invoicesRouter      from './routes/finance/invoices';
import paymentsRouter      from './routes/finance/payments';
import verifyPaymentRouter from './routes/finance/verifyPayment';
import propertyCreateRouter  from './routes/properties/create';
import propertySettingsRouter from './routes/properties/settings';
import roomsRouter         from './routes/rooms/index';
import roomCreateRouter    from './routes/rooms/create';
import bedCreateRouter     from './routes/beds/create';
import staffRouter         from './routes/staff/add';
import dashboardRouter     from './routes/dashboard/owner';
import noticeRouter        from './routes/moveOut/notice';
import noticesRouter       from './routes/moveOut/notices';
import settleRouter        from './routes/moveOut/settle';
import completeRouter      from './routes/moveOut/complete';
import complaintsRouter    from './routes/complaints';
import profileRouter       from './routes/users/profile';
import changePinRouter     from './routes/users/change-password';

// ─── App Setup ───────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: true, // Allow all origins for mobile/expo testing
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Auth ────────────────────────────────────────────────────────────────────
app.use('/api/auth/login',    loginRouter);
app.use('/api/auth/register', registerRouter);
app.use('/api/auth/me',       meRouter);

// ─── Properties ──────────────────────────────────────────────────────────────
app.use('/api/properties',          propertyCreateRouter);     // POST /api/properties
app.use('/api/properties/settings', propertySettingsRouter);   // GET | PATCH /api/properties/settings

// ─── Tenants ─────────────────────────────────────────────────────────────────
app.use('/api/tenants',         tenantsRouter);       // GET  /api/tenants
app.use('/api/tenants/onboard', tenantOnboardRouter); // POST /api/tenants/onboard
app.use('/api/tenants',         tenantByIdRouter);    // GET  /api/tenants/:id

// ─── Finance ─────────────────────────────────────────────────────────────────
app.use('/api/finance/invoices',       invoicesRouter);
app.use('/api/finance/payments',       paymentsRouter);
app.use('/api/finance/verify-payment', verifyPaymentRouter);

// ─── Inventory (Rooms & Beds) ─────────────────────────────────────────────────
app.use('/api/rooms', roomsRouter);      // GET  /api/rooms
app.use('/api/rooms', roomCreateRouter); // POST /api/rooms
app.use('/api/beds',  bedCreateRouter);  // POST /api/beds

// ─── Staff ───────────────────────────────────────────────────────────────────
app.use('/api/staff', staffRouter); // GET / POST / DELETE /:id

// ─── Dashboard ───────────────────────────────────────────────────────────────
app.use('/api/dashboard', dashboardRouter);

// ─── Move-Out ────────────────────────────────────────────────────────────────
app.use('/api/moveout/notice',   noticeRouter);   // POST (Tenant submits)
app.use('/api/moveout/notices',  noticesRouter);  // GET  (list for Owner/Manager)
app.use('/api/moveout/settle',   settleRouter);   // POST (generate settlement)
app.use('/api/moveout/complete', completeRouter); // POST (finalise move-out)

// ─── Complaints ───────────────────────────────────────────────────────────────
app.use('/api/complaints', complaintsRouter);

// ─── User Account ────────────────────────────────────────────────────────────
app.use('/api/users/profile',     profileRouter);   // PATCH
app.use('/api/users/change-pin',  changePinRouter); // POST

// ─── 404 Fallback ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── MongoDB + Start Server ───────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀  MyPg Hub backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

export default app;
