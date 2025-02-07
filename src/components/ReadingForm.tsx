import React, { useState } from 'react';
import { PlusCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { ReadingFormData } from '../types/bloodPressure';

interface Props {
  onSubmit: (reading: ReadingFormData) => void;
  initialData?: ReadingFormData;
  submitLabel?: string;
}

export function ReadingForm({ onSubmit, initialData, submitLabel = 'Add Reading' }: Props) {
  const [formData, setFormData] = useState<ReadingFormData>({
    systolic: initialData?.systolic ?? '',
    diastolic: initialData?.diastolic ?? '',
    pulse: initialData?.pulse ?? '',
    datetime: initialData?.datetime ?? format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    id: initialData?.id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        systolic: '',
        diastolic: '',
        pulse: '',
        datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Systolic
          </label>
          <input
            type="number"
            id="systolic"
            name="systolic"
            value={formData.systolic}
            onChange={handleChange}
            placeholder="120"
            className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            required
            min="70"
            max="200"
          />
        </div>
        <div>
          <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Diastolic
          </label>
          <input
            type="number"
            id="diastolic"
            name="diastolic"
            value={formData.diastolic}
            onChange={handleChange}
            placeholder="80"
            required
            min="40"
            max="130"
            className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pulse" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pulse (optional)
          </label>
          <input
            type="number"
            id="pulse"
            name="pulse"
            value={formData.pulse}
            onChange={handleChange}
            placeholder="72"
            className="w-full px-2 sm:px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            min="40"
            max="200"
          />
        </div>
      </div>
      <div className="mb-6">
        <div>
          <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date & Time
            </span>
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="datetime"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              className="w-full pl-2 sm:pl-3 pr-2 sm:pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700
                text-gray-900 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert
                [&::-webkit-calendar-picker-indicator]:dark:opacity-50
                [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer
                [&::-webkit-calendar-picker-indicator]:p-0
                [&::-webkit-calendar-picker-indicator]:h-5
                [&::-webkit-calendar-picker-indicator]:w-5
                [&::-webkit-calendar-picker-indicator]:mr-2"
              required
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusCircle className="w-5 h-5" />
        {submitLabel}
      </button>
    </form>
  );
}