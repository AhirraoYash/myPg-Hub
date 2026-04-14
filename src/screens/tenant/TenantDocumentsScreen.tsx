import { useState, useRef } from 'react';
import { ArrowLeft, FileText, Trash2, Upload, File, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

type DocumentItem = {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  date: string;
  size: string;
};

export default function TenantDocumentsScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: '1', name: 'Aadhar Card (Front & Back)', type: 'image', date: '10 Apr 2026', size: '2.4 MB' },
    { id: '2', name: 'Rent Agreement - 2026', type: 'pdf', date: '01 Apr 2026', size: '1.1 MB' },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'doc',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
      default: return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-6 pt-14 pb-24 overflow-y-auto hide-scrollbar relative">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Document Vault</h1>
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5">Securely store your IDs</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,.pdf,.doc,.docx"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-white border-2 border-dashed border-blue-200 rounded-[1.25rem] py-8 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition-colors group shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                <span className="text-sm font-bold text-blue-600">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-extrabold text-blue-900">Upload New Document</p>
                  <p className="text-xs font-medium text-blue-600/70 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </>
            )}
          </button>
        </div>

        {/* Documents List */}
        <div>
          <h3 className="text-sm font-extrabold text-gray-900 mb-4">Uploaded Documents</h3>
          
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {documents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-gray-100 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-extrabold text-gray-900">No Documents Found</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Upload your ID proof or agreements here.</p>
                </motion.div>
              ) : (
                documents.map((doc) => (
                  <motion.div 
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-[1.25rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 border border-gray-100 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                        {getIcon(doc.type)}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-extrabold text-gray-900 truncate pr-4">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{doc.size}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{doc.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeDocument(doc.id)}
                      className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
