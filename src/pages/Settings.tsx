import React, { useContext, useEffect } from 'react';
import { SettingsContext } from '../lib/SettingsContext';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Monitor, DollarSign, Save, RefreshCcw, Download } from 'lucide-react';
import {
  getAccounts,
  getIncomes,
  getExpenses,
  getFriendTransactions,
  getBudgetGoals,
  getSavingsGoals
} from '../lib/api';

const currencyOptions = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'INR', label: 'Indian Rupee (₹)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'JPY', label: 'Japanese Yen (¥)' },
];

const themeOptions = [
  { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
];

function toCSVSection(title, arr) {
  if (!arr || arr.length === 0) return '';
  const keys = Object.keys(arr[0]);
  const header = keys.join(',');
  const rows = arr.map(obj => keys.map(k => JSON.stringify(obj[k] ?? '')).join(','));
  return `\n\n# ${title}\n${header}\n${rows.join('\n')}`;
}

const Settings: React.FC = () => {
  const { settings, setSettings, resetSettings } = useContext(SettingsContext);
  const { toast } = useToast();

  useEffect(() => {
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      document.documentElement.classList.toggle('light', !prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      document.documentElement.classList.toggle('light', settings.theme === 'light');
    }
  }, [settings.theme]);

  function handleChange<Key extends keyof typeof settings>(key: Key, value: (typeof settings)[Key]) {
    setSettings({ ...settings, [key]: value });
  }

  const handleSave = () => {
    toast({ title: 'Settings saved', description: 'Your preferences have been updated.' });
  };

  const handleReset = () => {
    resetSettings();
    toast({ title: 'Settings reset', description: 'All settings have been reset to defaults.' });
  };

  // Export logic
  const handleExport = async (type: 'json' | 'csv') => {
    try {
      const [accounts, incomes, expenses, friendTransactions, budgetGoals, savingsGoals] = await Promise.all([
        getAccounts(),
        getIncomes(),
        getExpenses(),
        getFriendTransactions(),
        getBudgetGoals(),
        getSavingsGoals()
      ]);
      if (type === 'json') {
        const data = {
          accounts,
          incomes,
          expenses,
          friendTransactions,
          budgetGoals,
          savingsGoals
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finance_data_export.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast({ title: 'Export Successful', description: 'Your data has been exported as JSON.' });
      } else {
        // CSV
        let csv = '';
        csv += toCSVSection('Accounts', accounts);
        csv += toCSVSection('Incomes', incomes);
        csv += toCSVSection('Expenses', expenses);
        csv += toCSVSection('Friend Transactions', friendTransactions);
        csv += toCSVSection('Budget Goals', budgetGoals);
        csv += toCSVSection('Savings Goals', savingsGoals);
        const blob = new Blob([csv.trim()], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finance_data_export.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast({ title: 'Export Successful', description: 'Your data has been exported as CSV.' });
      }
    } catch (err) {
      toast({ title: 'Export Failed', description: 'Could not export your data. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="w-full space-y-6 py-4 sm:space-y-8">
      <div className="space-y-2 px-4 pt-2 sm:px-8">
        <h1 className="text-3xl font-bold text-card-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your appearance, currency, and conversion preferences</p>
      </div>
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {/* Appearance Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 sm:p-6 sm:pb-2">
            <Sun className="w-6 h-6 text-emerald-500" aria-hidden="true" />
            <CardTitle className="text-xl font-semibold leading-tight">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            <div>
              <p id="settings-theme-label" className="mb-1 font-semibold">Theme</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="settings-theme-label">
                {themeOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange('theme', opt.value)}
                    className={`flex min-h-11 items-center gap-2 px-3 py-2 sm:px-4 rounded-lg border font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none
                      ${settings.theme === opt.value
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-muted hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'}
                    `}
                    aria-pressed={settings.theme === opt.value}
                    aria-label={opt.label}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Choose your preferred theme for the app.</p>
            </div>
          </CardContent>
        </Card>
        {/* Currency & Conversion Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 sm:p-6 sm:pb-2">
            <DollarSign className="w-6 h-6 text-emerald-500" aria-hidden="true" />
            <CardTitle className="text-xl font-semibold leading-tight">Currency & Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 pt-0 sm:p-6 sm:pt-0">
            <div>
              <label htmlFor="settings-currency" className="mb-1 block font-semibold">Preferred Currency</label>
              <Select value={settings.preferredCurrency} onValueChange={v => handleChange('preferredCurrency', v)}>
                <SelectTrigger id="settings-currency" className="w-full rounded-lg border focus:ring-2 focus:ring-emerald-400">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(opt => (
                    <SelectItem key={opt.code} value={opt.code}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">This is the main currency for all money displays.</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <label htmlFor="conversionEnabled" className="font-semibold">Enable Currency Conversion</label>
                <p className="text-xs text-muted-foreground mt-1">If enabled, you can hover over money to see the value in another currency.</p>
              </div>
              <Switch
                checked={settings.conversionEnabled}
                onCheckedChange={v => handleChange('conversionEnabled', v)}
                className="shrink-0 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted focus-visible:ring-2 focus-visible:ring-emerald-400"
                aria-label="Enable Currency Conversion"
                id="conversionEnabled"
              />
            </div>
            <div>
              <label htmlFor="settings-conversion-currency" className="mb-1 block font-semibold">Conversion Target Currency</label>
              <Select value={settings.conversionCurrency} onValueChange={v => handleChange('conversionCurrency', v)} disabled={!settings.conversionEnabled}>
                <SelectTrigger id="settings-conversion-currency" className="w-full rounded-lg border focus:ring-2 focus:ring-emerald-400" disabled={!settings.conversionEnabled}>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map(opt => (
                    <SelectItem key={opt.code} value={opt.code}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Currency to show on hover (if conversion is enabled).</p>
            </div>
          </CardContent>
        </Card>
        {/* Export Data Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 sm:p-6 sm:pb-2">
            <Download className="w-6 h-6 text-emerald-500" aria-hidden="true" />
            <CardTitle className="text-xl font-semibold leading-tight">Export Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
            <p className="text-muted-foreground mb-2">Export all your finance data for backup or use elsewhere. You can choose JSON or CSV format.</p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <button
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white min-h-11 px-4 py-2.5 sm:px-5 rounded-lg font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                type="button"
                onClick={() => handleExport('json')}
                aria-label="Export as JSON"
              >
                <Download className="w-4 h-4" />
                Export as JSON
              </button>
              <button
                className="flex items-center gap-2 bg-muted hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 min-h-11 px-4 py-2.5 sm:px-5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors font-semibold shadow focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                type="button"
                onClick={() => handleExport('csv')}
                aria-label="Export as CSV"
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
            </div>
          </CardContent>
        </Card>
        {/* Save/Reset Buttons */}
        <div className="flex flex-wrap justify-end gap-2 px-4 pb-4 sm:gap-4 sm:px-8">
          <button
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white min-h-11 px-4 py-2.5 sm:px-5 rounded-lg font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            type="button"
            onClick={handleSave}
            aria-label="Save Settings"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
          <button
            className="flex items-center gap-2 bg-muted hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-400 min-h-11 px-4 py-2.5 sm:px-5 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors font-semibold shadow focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
            type="button"
            onClick={handleReset}
            aria-label="Reset to Defaults"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
