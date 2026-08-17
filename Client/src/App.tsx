import { useState } from "react";
import { Wrench, Cpu, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function App() {
  const [device, setDevice] = useState("");
  const [symptom, setSymptom] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResult(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-base-300 text-base-content p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between pb-6 mb-8 border-b border-base-200">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-primary-content rounded-xl">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AllEctronix AI</h1>
            <p className="text-xs opacity-60">Hardware Diagnostic Engine v1.0</p>
          </div>
        </div>
        <div className="badge badge-success gap-2 p-3">
          <CheckCircle2 className="h-4 w-4" /> System Ready
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form Panel */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center gap-2 mb-2">
              <Cpu className="h-5 w-5 text-primary" /> Input System Parameters
            </h2>
            
            <form onSubmit={handleDiagnose} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Device / Board Type</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pioneer Audio Amp / PCB-402"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Observed Fault / Symptoms</span>
                </label>
                <textarea
                  placeholder="e.g. Blown fuse, immediate heat on channel A, 0V rail output"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  required
                  className="textarea textarea-bordered h-28 w-full"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn btn-primary w-full mt-2"
              >
                {isAnalyzing ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Analyzing PCB Schematics...
                  </>
                ) : (
                  "Run AI Diagnostic"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Diagnostic Output Panel */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Diagnostic Analysis
            </h2>

            {!hasResult ? (
              <div className="flex flex-col items-center justify-center h-64 text-center opacity-50 space-y-2">
                <Cpu className="h-12 w-12 stroke-1" />
                <p>Fill in the parameters and trigger a diagnostic check.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="alert alert-warning shadow-sm text-sm">
                  <span><strong>Possible Cause:</strong> Shorted Output Power IC (TDA7385) or failed smoothing capacitor.</span>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-1">Recommended Action Steps:</h3>
                  <ul className="list-disc list-inside text-xs space-y-1 opacity-80">
                    <li>Isolate Channel A rail output with multimeter.</li>
                    <li>Verify diode drop across pin 3 and ground.</li>
                    <li>Inspect resistor R402 for thermal discoloration.</li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-base-200">
                  <h3 className="font-semibold text-sm mb-2">Matched Parts Inventory:</h3>
                  <div className="flex items-center justify-between p-2 bg-base-200 rounded-lg text-xs">
                    <div>
                      <div className="font-mono font-bold">TDA7385-IC</div>
                      <div className="opacity-60">Quad Audio Power Amplifier</div>
                    </div>
                    <div className="text-right">
                      <div className="badge badge-sm badge-outline badge-success mb-1">In Stock</div>
                      <div className="font-bold">$4.99</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}