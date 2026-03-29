import { useQueueStore } from '@/stores/queueStore';
import { Badge } from '@/components/ui/badge';

const QueueBoard = () => {
  const { getCurrentOPD, getWaitingOPD, getProcedureQueue } = useQueueStore();
  const current = getCurrentOPD();
  const waiting = getWaitingOPD();
  const procedure = getProcedureQueue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center p-8">
      <div className="text-center mb-20">
        <h1 className="text-6xl font-black tracking-tight mb-8">RENEW CLINIC</h1>
        <p className="text-xl opacity-90 mb-12">Now Serving</p>
        
        {/* Current Token */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl mx-auto mb-16">
          {current ? (
            <>
              <div className="text-8xl font-black text-yellow-400 mb-8 animate-pulse">{current.token_number}</div>
              <div className="text-3xl font-bold text-white/90">{current.patient_name}</div>
              <Badge className="mt-6 text-lg px-8 py-3 bg-emerald-500/20 border-emerald-400">OPD Counter</Badge>
            </>
          ) : (
            <div className="text-4xl opacity-50">No current token</div>
          )}
        </div>

        {/* Queues */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full">
          <div>
            <h3 className="text-2xl font-bold mb-6">OPD Waiting ({waiting.length})</h3>
            <div className="space-y-3">
              {waiting.slice(0, 5).map(token => (
                <div key={token.id} className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-black">{token.token_number}</div>
                  <div className="opacity-80">{token.patient_name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-6">Procedure Queue ({procedure.length})</h3>
            <div className="space-y-3">
              {procedure.slice(0, 5).map(token => (
                <div key={token.id} className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
                  <div className="text-4xl font-black text-purple-300">{token.token_number}</div>
                  <div className="opacity-80">{token.patient_name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueBoard;

