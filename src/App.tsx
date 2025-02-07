import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ThemeToggle } from './components/ThemeToggle';
import { ReadingForm } from './components/ReadingForm';
import { BPChart } from './components/BPChart';
import { History } from './components/History';
import { CategoryBadge } from './components/CategoryBadge';
import { ReadingStats } from './components/ReadingStats';
import { Modal } from './components/Modal';
import { getBPCategory } from './utils/bloodPressure';
import type { BloodPressureReading, ReadingFormData } from './types/bloodPressure';
import * as db from './db';

function App() {
  const [readings, setReadings] = useState<BloodPressureReading[]>([]);
  const [editingReading, setEditingReading] = useState<ReadingFormData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  useEffect(() => {
    // Load initial readings from database
    db.getAllReadings().then(setReadings);
  }, []);

  const handleAddReading = (formData: ReadingFormData) => {
    // Parse datetime from form
    const timestamp = formData.datetime
      ? new Date(formData.datetime)
      : new Date();
    
    const newReading: BloodPressureReading = {
      id: crypto.randomUUID(),
      systolic: Number(formData.systolic),
      diastolic: Number(formData.diastolic),
      timestamp,
    };
    if (formData.pulse) {
      newReading.pulse = Number(formData.pulse);
    }
    
    // Save to database
    db.addReading(newReading).then(() => {
      setReadings(prev => [...prev, newReading]);
    });
  };

  const handleEditReading = (formData: ReadingFormData) => {
    if (!formData.id) return;
    
    // Parse datetime from form
    const timestamp = formData.datetime
      ? new Date(formData.datetime)
      : new Date();
    
    const updatedReading: BloodPressureReading = {
      id: formData.id,
      systolic: Number(formData.systolic),
      diastolic: Number(formData.diastolic),
      pulse: formData.pulse ? Number(formData.pulse) : undefined,
      timestamp,
    };
    
    // Update in database
    db.updateReading(updatedReading).then(() => {
      setReadings(prev => prev.map(reading => reading.id === formData.id ? updatedReading : reading));
      setEditingReading(null);
    });
  };

  const handleDeleteReading = (id: string) => {
    // Delete from database
    db.deleteReading(id).then(() => {
      setReadings(prev => prev.filter(reading => reading.id !== id));
      setDeletingId(null);
    });
  };
  
  const handleImportReadings = async (importedReadings: BloodPressureReading[]) => {
    // Save all imported readings to database
    await Promise.all(importedReadings.map(reading => db.addReading(reading)));
    // Update state with new readings
    setReadings(prev => [...prev, ...importedReadings]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white shadow-md dark:bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-800/75">
        <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <Activity className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                  Blood Pressure Monitor
                </h1>
                <ThemeToggle />
              </div>
            </div>
            {readings.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status:</span>
                <CategoryBadge
                  category={getBPCategory(
                    readings[readings.length - 1].systolic,
                    readings[readings.length - 1].diastolic
                  )}
                  showDescription={false}
                />
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:gap-6">
            <p className="flex-1 text-sm text-gray-600 dark:text-gray-400">
              Track and monitor your blood pressure readings over time. This tool is for informational purposes only.
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p>
                Always consult with your healthcare provider for diagnosis and treatment.
              </p>
            </div>
          </div>
          {readings.length > 0 && window.innerWidth < 640 && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                <CategoryBadge
                  category={getBPCategory(
                    readings[readings.length - 1].systolic,
                    readings[readings.length - 1].diastolic
                  )}
                  showDescription={false}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8 min-h-[calc(100vh-theme(spacing.32))]">
        <div className="py-4 sm:py-6">
          <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <ReadingForm onSubmit={handleAddReading} />
              <ReadingStats readings={readings} />
              {readings.length > 0 && <BPChart data={readings} />}
            </div>
            <div>
              <History
                readings={readings}
                onDelete={id => setDeletingId(id)}
                onImport={handleImportReadings}
                onEdit={reading => setEditingReading({
                  id: reading.id,
                  systolic: reading.systolic.toString(),
                  diastolic: reading.diastolic.toString(),
                  pulse: reading.pulse?.toString() ?? '',
                  datetime: format(reading.timestamp, "yyyy-MM-dd'T'HH:mm"),
                })}
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ by <a href="https://donvitocodes.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">DonvitoCodes</a>
            {' • '}
            <a href="https://github.com/donvito" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">GitHub</a>
            {' • '}
            <a href="https://x.com/donvito" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">X</a>
          </p>
        </div>
      </footer>
      
      <Modal
        isOpen={editingReading !== null}
        onClose={() => setEditingReading(null)}
        title="Edit Reading"
      >
        {editingReading && (
          <ReadingForm
            onSubmit={handleEditReading}
            initialData={editingReading}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      <Modal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="Confirm Deletion"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this reading? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setDeletingId(null)}
              className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => deletingId && handleDeleteReading(deletingId)}
              className="flex-1 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
