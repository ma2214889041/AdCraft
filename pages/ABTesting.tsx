import React, { useState } from 'react';
import { ABTest, ABVariant } from '../types';
import { Button } from '../components/Button';
import { Split, Plus, Play, Pause, Trophy, TrendingUp, Eye, MousePointerClick, DollarSign, BarChart3 } from 'lucide-react';

export const ABTesting: React.FC = () => {
  const [tests, setTests] = useState<ABTest[]>([
    {
      id: '1',
      name: 'Summer Sale Campaign',
      status: 'running',
      createdAt: Date.now() - 86400000 * 3,
      variants: [
        {
          id: 'a1',
          name: 'Variant A - Discount Focus',
          videoUrl: 'https://example.com/video-a.mp4',
          metrics: { views: 12500, clicks: 450, ctr: 3.6, conversions: 89, cost: 450 }
        },
        {
          id: 'a2',
          name: 'Variant B - Feature Focus',
          videoUrl: 'https://example.com/video-b.mp4',
          metrics: { views: 11800, clicks: 620, ctr: 5.25, conversions: 124, cost: 480 }
        },
        {
          id: 'a3',
          name: 'Variant C - Social Proof',
          videoUrl: 'https://example.com/video-c.mp4',
          metrics: { views: 13200, clicks: 580, ctr: 4.39, conversions: 102, cost: 465 }
        }
      ],
      winner: 'a2'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTestName, setNewTestName] = useState('');

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-slate-500/20 text-slate-400',
      running: 'bg-green-500/20 text-green-400 animate-pulse',
      completed: 'bg-blue-500/20 text-blue-400'
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  const calculateWinner = (variants: ABVariant[]): string => {
    // Winner based on conversion rate
    const sorted = [...variants].sort((a, b) => {
      const convRateA = a.metrics.conversions / a.metrics.views;
      const convRateB = b.metrics.conversions / b.metrics.views;
      return convRateB - convRateA;
    });
    return sorted[0].id;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Split className="w-8 h-8 text-brand-purple" />
            A/B Testing
          </h1>
          <p className="text-slate-400">Test and optimize your ad creatives for better performance</p>
        </div>

        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Test
        </Button>
      </div>

      {/* Tests List */}
      <div className="space-y-6">
        {tests.map(test => (
          <div key={test.id} className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
            {/* Test Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white">{test.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(test.status)}`}>
                    {test.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Started {new Date(test.createdAt).toLocaleDateString()} • {test.variants.length} variants
                </p>
              </div>

              <div className="flex gap-2">
                {test.status === 'running' && (
                  <Button size="sm" variant="outline">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>

            {/* Variants Comparison */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {test.variants.map(variant => {
                  const isWinner = variant.id === test.winner;
                  const convRate = ((variant.metrics.conversions / variant.metrics.views) * 100).toFixed(2);
                  const roas = ((variant.metrics.conversions * 50) / variant.metrics.cost).toFixed(2); // Assuming $50 per conversion

                  return (
                    <div
                      key={variant.id}
                      className={`relative bg-black/30 border-2 rounded-xl p-4 transition-all ${
                        isWinner
                          ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Winner Badge */}
                      {isWinner && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Trophy className="w-3 h-3" />
                          WINNER
                        </div>
                      )}

                      {/* Video Preview */}
                      <div className="aspect-video bg-gradient-to-br from-brand-purple/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white/30" />
                      </div>

                      {/* Variant Name */}
                      <h3 className="text-white font-bold mb-4">{variant.name}</h3>

                      {/* Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Views
                          </span>
                          <span className="text-white font-bold">{variant.metrics.views.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <MousePointerClick className="w-4 h-4" /> Clicks
                          </span>
                          <span className="text-white font-bold">{variant.metrics.clicks.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> CTR
                          </span>
                          <span className={`font-bold ${isWinner ? 'text-green-400' : 'text-white'}`}>
                            {variant.metrics.ctr.toFixed(2)}%
                          </span>
                        </div>

                        <div className="h-px bg-white/10" />

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Conversions</span>
                          <span className="text-green-400 font-bold">{variant.metrics.conversions}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Conv. Rate</span>
                          <span className={`font-bold ${isWinner ? 'text-green-400' : 'text-white'}`}>
                            {convRate}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> ROAS
                          </span>
                          <span className={`font-bold ${parseFloat(roas) > 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {roas}x
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Cost</span>
                          <span className="text-white">${variant.metrics.cost}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Insights */}
              {test.winner && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-xl">
                  <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Key Insights
                  </h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Variant B performs {((test.variants[1].metrics.ctr / test.variants[0].metrics.ctr - 1) * 100).toFixed(0)}% better in CTR</li>
                    <li>• Feature-focused messaging drives {((test.variants[1].metrics.conversions / test.variants[0].metrics.conversions - 1) * 100).toFixed(0)}% more conversions</li>
                    <li>• Recommended: Scale Variant B for maximum ROI</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tests.length === 0 && (
        <div className="text-center py-20 bg-surface border border-white/10 rounded-2xl">
          <Split className="w-20 h-20 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No A/B Tests Yet</h3>
          <p className="text-slate-400 mb-6">Create your first test to start optimizing your ads</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create Test
          </Button>
        </div>
      )}
    </div>
  );
};
