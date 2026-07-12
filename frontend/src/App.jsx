import { useState } from 'react';
import { CloudRain, Thermometer, Wind, CloudLightning, Loader2, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './index.css';

// Sample data for the dashboard charts (simulating descriptive analysis results)
const monthlyRainfallData = [
  { month: 'Jan', rain: 150 }, { month: 'Feb', rain: 120 },
  { month: 'Mar', rain: 180 }, { month: 'Apr', rain: 250 },
  { month: 'May', rain: 320 }, { month: 'Jun', rain: 200 },
  { month: 'Jul', rain: 150 }, { month: 'Aug', rain: 140 },
  { month: 'Sep', rain: 210 }, { month: 'Oct', rain: 350 },
  { month: 'Nov', rain: 400 }, { month: 'Dec', rain: 250 },
];

const tempTrendData = [
  { year: '2010', temp: 24.5 }, { year: '2012', temp: 24.8 },
  { year: '2014', temp: 25.1 }, { year: '2016', temp: 25.4 },
  { year: '2018', temp: 25.7 }, { year: '2020', temp: 26.0 },
];

function App() {
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    max_temperature: 30.0,
    min_temperature: 22.0,
    rainfall: 0.0,
    max_wind_speed: 15.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch prediction from server.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to the API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <CloudLightning size={40} className="header-icon" />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Sri Lanka Weather Predictor</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Advanced ML Analytics & Forecasting</p>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Left Column: Form */}
        <aside>
          <div className="glass-panel">
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Thermometer size={20} /> Input Parameters
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Month (1-12)</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                  <input type="number" min="1" max="12" name="month" value={formData.month} onChange={handleInputChange} className="form-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Max Temperature (°C)</label>
                <div style={{ position: 'relative' }}>
                  <Thermometer size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#ef4444' }} />
                  <input type="number" step="0.1" name="max_temperature" value={formData.max_temperature} onChange={handleInputChange} className="form-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Min Temperature (°C)</label>
                <div style={{ position: 'relative' }}>
                  <Thermometer size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#38bdf8' }} />
                  <input type="number" step="0.1" name="min_temperature" value={formData.min_temperature} onChange={handleInputChange} className="form-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rainfall (mm)</label>
                <div style={{ position: 'relative' }}>
                  <CloudRain size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#818cf8' }} />
                  <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleInputChange} className="form-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Max Wind Speed (km/h)</label>
                <div style={{ position: 'relative' }}>
                  <Wind size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#a7f3d0' }} />
                  <input type="number" step="0.1" name="max_wind_speed" value={formData.max_wind_speed} onChange={handleInputChange} className="form-input" style={{ paddingLeft: '40px' }} required />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '32px' }}>
                {loading ? <Loader2 className="animate-spin" /> : <CloudLightning />}
                {loading ? 'Predicting...' : 'Run Prediction'}
              </button>
            </form>
          </div>
        </aside>

        {/* Right Column: Dashboard */}
        <main>
          {error && (
            <div className="glass-panel" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', marginBottom: '24px' }}>
              <h3 style={{ color: '#fca5a5' }}>Error</h3>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="glass-panel result-card" style={{ 
              borderColor: result.will_rain_tomorrow ? 'rgba(14, 165, 233, 0.4)' : 'rgba(16, 185, 129, 0.4)' 
            }}>
              <h3 style={{ color: 'var(--text-secondary)' }}>Tomorrow's Forecast</h3>
              <div className="result-value">
                {result.will_rain_tomorrow ? 'Rain Expected 🌧️' : 'Clear Skies ☀️'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Rain Probability</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{(result.rain_probability * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Predicted Temp</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{result.predicted_mean_temperature}°C</p>
                </div>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="glass-panel" style={{ marginBottom: '32px', textAlign: 'center', padding: '48px 24px', borderStyle: 'dashed' }}>
              <CloudLightning size={48} style={{ color: 'var(--glass-border)', margin: '0 auto 16px auto' }} />
              <h3 style={{ color: 'var(--text-secondary)' }}>Awaiting Input</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter weather parameters on the left to generate a forecast.</p>
            </div>
          )}

          <div className="charts-grid">
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Average Monthly Rainfall (Historical)</h4>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyRainfallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="rain" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Temperature Trend Over Years</h4>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <AreaChart data={tempTrendData}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
