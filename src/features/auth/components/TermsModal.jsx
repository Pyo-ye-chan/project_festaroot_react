const TermsModal = ({ isOpen, onClose, terms }) => {
  if (!isOpen || !terms) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-gray-900">
              {terms.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              버전 {terms.version}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700 font-bold"
          >
            ×
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-7 font-medium">
            {terms.content}
          </pre>
        </div>

        <div className="flex justify-end mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-festival-purple text-white font-bold hover:opacity-90"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;