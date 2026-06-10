import React, { useState } from 'react';
import { X, CalendarDays, MapPin, Users, Tag, Info } from 'lucide-react';

const CreateGatheringModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [festival, setFestival] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to a backend or a global state manager
    console.log({ title, festival, description, date, location, maxParticipants });
    alert('모임이 생성되었습니다! (실제 기능은 구현되지 않았습니다)');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">새 모임 만들기</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Tag className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 모임 제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 부산 록 페스티벌 같이 즐길 사람!"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="festival" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 관련 축제 (선택 사항)
            </label>
            <input
              type="text"
              id="festival"
              value={festival}
              onChange={(e) => setFestival(e.target.value)}
              placeholder="예: 부산 록 페스티벌"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 모임 설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="모임에 대한 자세한 내용을 작성해주세요. (예: 어떤 활동을 할 건지, 준비물 등)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all resize-none"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <CalendarDays className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 날짜
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 장소
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 잠실 주경기장"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2 text-[var(--festival-purple)]" /> 최대 인원
            </label>
            <input
              type="number"
              id="maxParticipants"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              min="2"
              max="20"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors active:scale-95"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent text-white font-bold rounded-full shadow-sm bg-[var(--festival-purple)] hover:bg-[var(--festival-purple-soft)] transition-colors active:scale-95"
            >
              모임 생성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGatheringModal;