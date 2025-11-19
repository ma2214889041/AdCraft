import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Save, RefreshCw, Database, Key, Bell, Shield, Globe, Palette } from 'lucide-react';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'AdCraft',
    siteUrl: 'https://adcraft.ai',
    apiKey: 'sk-••••••••••••••••',
    maxStoragePerUser: '5000', // MB
    enableSignups: true,
    enableNotifications: true,
    maintenanceMode: false,
    defaultLanguage: 'en',
    primaryColor: '#8b5cf6'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings logic here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-slate-400">Configure your platform settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* General Settings */}
      <div className="bg-surface border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-brand-purple" />
          <h2 className="text-xl font-bold text-white">General</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-brand-purple outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Site URL</label>
              <input
                type="text"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-brand-purple outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Default Language</label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-brand-purple outline-none"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="bg-surface border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-brand-purple" />
          <h2 className="text-xl font-bold text-white">API Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Google Gemini API Key</label>
            <div className="flex gap-3">
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-brand-purple outline-none"
              />
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Used for AI script generation and video creation</p>
          </div>
        </div>
      </div>

      {/* Storage Settings */}
      <div className="bg-surface border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-brand-purple" />
          <h2 className="text-xl font-bold text-white">Storage & Limits</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Max Storage Per User (MB)</label>
            <input
              type="number"
              value={settings.maxStoragePerUser}
              onChange={(e) => setSettings({ ...settings, maxStoragePerUser: e.target.value })}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-brand-purple outline-none"
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-surface border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-brand-purple" />
          <h2 className="text-xl font-bold text-white">Features & Permissions</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'enableSignups', label: 'Enable New User Signups', description: 'Allow new users to register' },
            { key: 'enableNotifications', label: 'Enable Email Notifications', description: 'Send email notifications to users' },
            { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Put the site in maintenance mode' }
          ].map(feature => (
            <div key={feature.key} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div>
                <p className="text-white font-medium">{feature.label}</p>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, [feature.key]: !settings[feature.key as keyof typeof settings] })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings[feature.key as keyof typeof settings]
                    ? 'bg-brand-purple'
                    : 'bg-slate-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${
                  settings[feature.key as keyof typeof settings]
                    ? 'translate-x-6'
                    : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-surface border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-brand-purple" />
          <h2 className="text-xl font-bold text-white">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Primary Color</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-20 h-12 bg-black/30 border border-white/10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-brand-purple outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Changes Saved!' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
};
