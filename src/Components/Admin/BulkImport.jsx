import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BulkImport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a CSV or Excel file');
        return;
      }
      
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/products/template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product_import_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download template');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login as admin');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/admin/products/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setFile(null);
        // Reset file input
        document.getElementById('file-upload').value = '';
      } else {
        setError(data.error || 'Import failed');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-20 mt-28">
      <div className="w-[90%] max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link to="/admin/dashboard" className="text-white/60 hover:text-white font2 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white font1">BULK IMPORT PRODUCTS</h1>
          <p className="text-white/60 font2 mt-2">Import multiple products from CSV or Excel file</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-400 font1 mb-4">📋 Instructions</h2>
          <ol className="space-y-2 text-white/80 font2 list-decimal list-inside">
            <li>Download the CSV template by clicking the button below</li>
            <li>Fill in your product details in the template</li>
            <li>Make sure category names match exactly with existing categories</li>
            <li>Upload the completed file</li>
            <li>Review the import results</li>
          </ol>
        </div>

        {/* Template Download */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font1 mb-2">Download Template</h3>
              <p className="text-white/60 font2">Get the CSV template with sample data</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font2-bold transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Template
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white font1 mb-6">Upload File</h3>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 font2">
              {error}
            </div>
          )}

          {/* File Drop Zone */}
          <div
            className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-[#955E30] transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <svg className="mx-auto h-16 w-16 text-white/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            
            {file ? (
              <div>
                <p className="text-white font2 text-lg mb-2">{file.name}</p>
                <p className="text-white/60 font2 text-sm">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white font2 text-lg mb-2">Click to upload file</p>
                <p className="text-white/40 font2 text-sm">CSV or Excel (XLSX, XLS)</p>
              </div>
            )}
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="w-full mt-6 bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-4 rounded-lg font2-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </span>
            ) : (
              'Import Products'
            )}
          </button>
        </div>

        {/* Import Results */}
        {result && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="text-xl font-bold text-white font1 mb-6">Import Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font2">Successfully Imported</span>
                  <span className="text-3xl font-bold text-green-400 font1">
                    {result.imported_count}
                  </span>
                </div>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font2">Failed</span>
                  <span className="text-3xl font-bold text-red-400 font1">
                    {result.error_count}
                  </span>
                </div>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-white font2 mb-3">Errors:</h4>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-red-400 font2 text-sm mb-2">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-4">
              <Link to="/admin/products" className="flex-1">
                <button className="w-full bg-[#955E30] hover:bg-[#955E30]/80 text-white px-6 py-3 rounded-lg font2-bold transition-colors">
                  View Products
                </button>
              </Link>
              <button
                onClick={() => setResult(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font2-bold transition-colors border border-white/20"
              >
                Import More
              </button>
            </div>
          </div>
        )}

        {/* CSV Format Guide */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-bold text-white font1 mb-4">CSV Format Guide</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 text-[#955E30] font2">Column</th>
                  <th className="p-3 text-[#955E30] font2">Required</th>
                  <th className="p-3 text-[#955E30] font2">Description</th>
                </tr>
              </thead>
              <tbody className="text-white/80 font2">
                <tr className="border-b border-white/5">
                  <td className="p-3">product_name</td>
                  <td className="p-3">Yes</td>
                  <td className="p-3">Name of the product</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3">description</td>
                  <td className="p-3">No</td>
                  <td className="p-3">Product description</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3">price</td>
                  <td className="p-3">Yes</td>
                  <td className="p-3">Product price (e.g., 4500.00)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3">category_name</td>
                  <td className="p-3">Yes</td>
                  <td className="p-3">Must match existing category exactly</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3">image_url</td>
                  <td className="p-3">No</td>
                  <td className="p-3">URL of product image</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-3">video_url</td>
                  <td className="p-3">No</td>
                  <td className="p-3">URL of product video</td>
                </tr>
                <tr>
                  <td className="p-3">stock_quantity</td>
                  <td className="p-3">No</td>
                  <td className="p-3">Number of items in stock</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}