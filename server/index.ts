import express from 'express';
import cors from 'cors';
import kpiRoutes from './routes/kpi.routes';
// ... other imports

const app = express();

app.use(cors());
app.use(express.json());

// ... other middleware and routes
app.use('/api', kpiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 