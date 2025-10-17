import React from 'react';
import {GenerationForm} from '../components/GenerationForm';
import {Palette} from 'lucide-react';

export const NewImage: React.FC = () => {
    return (
        <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-md">
            <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-[#3b82f6] p-3 rounded-full shadow-lg">
                        <Palette className="w-6 h-6 text-white"/>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Image Generator Agent
                </h2>
                <p className="text-gray-600">
                    Transform your photos into incredible personalized caricatures with AI
                </p>
            </div>
            <GenerationForm/>
        </div>
    );
};