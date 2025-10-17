import React from 'react';
import {Card, CardDescription, CardHeader, CardTitle} from '../components/ui/Card';
import {ImageIcon, Palette} from 'lucide-react';
import {Link} from 'react-router-dom';
import clsx from 'clsx';

export const Dashboard: React.FC = () => {
  // Mock statistics data
  const stats = {
    imagesGenerated: 24,
    totalSessions: 8,
    favorites: 12,
    downloads: 18
  };

  return (
    <div className="max-w-7xl mx-auto bg-white min-h-screen p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Comics Mate!
        </h1>
        <p className="text-gray-600">
          Create amazing comic-style images with our AI-powered generator.
        </p>
      </div>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Images Generated</h3>
          <p className="text-gray-900 text-3xl font-bold">{stats.imagesGenerated}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Total Sessions</h3>
          <p className="text-gray-900 text-3xl font-bold">{stats.totalSessions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Favorites</h3>
          <p className="text-gray-900 text-3xl font-bold">{stats.favorites}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-700 text-sm font-medium mb-2">Downloads</h3>
          <p className="text-gray-900 text-3xl font-bold">{stats.downloads}</p>
        </div>
      </div>

      {/* Create new Images */}
      <div className="flex items-center justify-center content-center">
        <Link
            to="/new-image"
            className={clsx(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                'text-gray-900 hover:bg-[#374151] hover:text-white border-2 border-gray-900 mb-10 mt-10'
            )}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="font-medium">Create new image</span>
        </Link>
      </div>

      {/* Recent Images */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Images</h2>
          <button className="text-[#3b82f6] hover:text-blue-400 text-sm font-medium transition-colors">
            View all
          </button>
        </div>
        
        <Card className="bg-white border-gray-100 shadow-md">
          <CardHeader className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-gray-500" />
            </div>
            <CardTitle className="text-gray-800 mb-2">No images generated yet</CardTitle>
            <CardDescription className="text-gray-600 mb-4">
              Start creating amazing comic-style images with our AI generator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};