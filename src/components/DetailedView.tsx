
import React from 'react';
import { Battery } from '@/types/battery';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CircularGauge from './CircularGauge';
import ColorBar from './ColorBar';
import StatusIndicator from './StatusIndicator';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Battery as BatteryIcon, AlertTriangle, Info, Thermometer, Timer, Zap } from 'lucide-react';

interface DetailedViewProps {
  battery: Battery;
  isOpen: boolean;
  onClose: () => void;
}

const DetailedView: React.FC<DetailedViewProps> = ({ battery, isOpen, onClose }) => {
  // Generate mock historical data for the battery
  const generateHistoricalData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      // Add some random variation
      const randomFactor = 0.95 + Math.random() * 0.1;
      
      data.push({
        time: format(time, 'HH:mm'),
        soc: Math.max(0, Math.min(100, battery.soc * randomFactor)),
        voltage: Math.max(3.0, Math.min(4.2, battery.voltage * randomFactor)),
        temperature: Math.max(20, Math.min(45, battery.temperature * randomFactor)),
        esr: Math.max(15, Math.min(100, battery.esr * randomFactor)),
      });
    }
    
    return data;
  };
  
  const historicalData = generateHistoricalData();
  
  // Status messages
  const getStatusMessage = (status: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good':
        return 'Cell is performing well with good health metrics.';
      case 'warning':
        return 'Cell requires attention. Check battery parameters.';
      case 'danger':
        return 'Cell has critical issues. Immediate attention required!';
      default:
        return '';
    }
  };
  
  // Status icon
  const getStatusIcon = (status: 'good' | 'warning' | 'danger') => {
    switch (status) {
      case 'good':
        return <Info className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-danger-500" />;
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-11/12 h-[85vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {battery.name}
            <div className="ml-2 flex-shrink-0">
              {getStatusIcon(battery.status)}
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {getStatusMessage(battery.status)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Performance Charts</TabsTrigger>
            <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center gap-6">
                <CircularGauge 
                  value={battery.soc} 
                  label="State of Charge" 
                  size="lg"
                  thickness="thick"
                  colorMap={{ 0: '#ef4444', 20: '#f59e0b', 50: '#10b981' }}
                />
                
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Health Status</CardTitle>
                    <CardDescription>Current health metrics of the cell</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ColorBar 
                      value={battery.soh} 
                      label="State of Health" 
                      height="thick"
                      colorMap={{ 0: '#ef4444', 70: '#f59e0b', 85: '#10b981' }}
                    />
                    
                    <div className="pt-2">
                      <div className="flex items-center mb-2">
                        <Timer className="w-4 h-4 mr-2 text-neutral-500" />
                        <span className="text-sm font-medium">Cycle Count</span>
                      </div>
                      <div className="text-xl font-semibold">{battery.cycleCount} cycles</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Metrics</CardTitle>
                    <CardDescription>Current electrical parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-neutral-500">
                          <Zap className="w-4 h-4 mr-1" />
                          Voltage
                        </div>
                        <div className="text-2xl font-semibold">{battery.voltage.toFixed(2)} V</div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-neutral-500">
                          <BatteryIcon className="w-4 h-4 mr-1" />
                          Internal Resistance
                        </div>
                        <div className="text-2xl font-semibold">{battery.esr.toFixed(1)} mΩ</div>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-neutral-500">
                          <Thermometer className="w-4 h-4 mr-1" />
                          Temperature
                        </div>
                        <div className="text-2xl font-semibold">{battery.temperature.toFixed(1)} °C</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Last 24 Hours Overview</CardTitle>
                    <CardDescription>SoC trend from the last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={historicalData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="time" 
                            tick={{ fontSize: 12 }} 
                            tickLine={false}
                            stroke="#94a3b8"
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            tick={{ fontSize: 12 }} 
                            tickLine={false}
                            stroke="#94a3b8"
                          />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="soc" 
                            name="SoC (%)" 
                            stroke="#3b82f6" 
                            fill="#3b82f640" 
                            strokeWidth={2} 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Voltage Trends</CardTitle>
                  <CardDescription>Cell voltage over the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12 }} 
                          tickLine={false}
                          stroke="#94a3b8"
                        />
                        <YAxis 
                          domain={[3, 4.2]} 
                          tick={{ fontSize: 12 }} 
                          tickLine={false}
                          stroke="#94a3b8"
                        />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="voltage" 
                          name="Voltage (V)" 
                          stroke="#10b981" 
                          fill="#10b98140" 
                          strokeWidth={2} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Trends</CardTitle>
                  <CardDescription>Cell temperature over the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12 }} 
                          tickLine={false}
                          stroke="#94a3b8"
                        />
                        <YAxis 
                          domain={[15, 45]} 
                          tick={{ fontSize: 12 }} 
                          tickLine={false}
                          stroke="#94a3b8"
                        />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="temperature" 
                          name="Temperature (°C)" 
                          stroke="#f59e0b" 
                          fill="#f59e0b40" 
                          strokeWidth={2} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Internal Resistance Trends</CardTitle>
                  <CardDescription>Cell ESR over the last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12 }} 
                          tickLine={false}
                          stroke="#94a3b8"
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          tick={{ fontSize: 12 }} 
                          tickLine={false}
                          stroke="#94a3b8"
                        />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="esr" 
                          name="ESR (mΩ)" 
                          stroke="#ef4444" 
                          fill="#ef444440" 
                          strokeWidth={2} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Complete Cell Report</CardTitle>
                <CardDescription>Detailed metrics and status for {battery.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Electrical Parameters</h3>
                      
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-sm text-neutral-500">Voltage</p>
                          <p className="text-base font-medium">{battery.voltage.toFixed(2)} V</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">State of Charge</p>
                          <p className="text-base font-medium">{battery.soc.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Internal Resistance</p>
                          <p className="text-base font-medium">{battery.esr.toFixed(1)} mΩ</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Temperature</p>
                          <p className="text-base font-medium">{battery.temperature.toFixed(1)} °C</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Health & History</h3>
                      
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-sm text-neutral-500">State of Health</p>
                          <p className="text-base font-medium">{battery.soh.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Cycle Count</p>
                          <p className="text-base font-medium">{battery.cycleCount} cycles</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Status</p>
                          <StatusIndicator 
                            status={battery.status} 
                            value={battery.status.charAt(0).toUpperCase() + battery.status.slice(1)} 
                            size="sm"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Last Updated</p>
                          <p className="text-base font-medium">{format(battery.lastUpdated, 'MMM dd, HH:mm')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium text-lg mb-4">Recommendations</h3>
                    
                    {battery.status === 'good' && (
                      <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                        <div className="flex gap-2">
                          <Info className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-success-700">Cell is in good condition</p>
                            <p className="text-success-600 text-sm mt-1">
                              This cell is performing optimally. Continue with normal usage patterns.
                              Regular monitoring is still recommended to ensure continued performance.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {battery.status === 'warning' && (
                      <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                        <div className="flex gap-2">
                          <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-warning-700">Cell requires attention</p>
                            <p className="text-warning-600 text-sm mt-1">
                              This cell is showing signs of degradation. Consider reducing charge/discharge rates
                              and monitor for further deterioration. If metrics continue to decline, the cell may need replacement.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {battery.status === 'danger' && (
                      <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                        <div className="flex gap-2">
                          <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-danger-700">Cell requires immediate attention</p>
                            <p className="text-danger-600 text-sm mt-1">
                              This cell is in poor condition and may be unsafe to use. It is recommended to stop using
                              this cell immediately and replace it with a new one. Continuing to use this cell may pose
                              safety risks and could damage your device.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedView;
