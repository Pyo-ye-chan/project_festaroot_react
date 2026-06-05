import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  AlertCircle, 
  MoreVertical,
  ChevronLeft,
  Send,
  Trash2,
  Edit3,
  Bookmark,
  Eye
} from 'lucide-react';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Mock Data
  const post = {
    id: 1,
    category: '후기',
    title: '양평 딸기축제 다녀왔어요! 🍓 너무 재밌네요',
    author: '축제요정',
    authorId: 'user123',
    date: '2026.05.25 14:30',
    views: 1240,
    likes: 45,
    content: `안녕하세요! 이번 주말에 가족들과 함께 양평 딸기축제에 다녀왔습니다.
    
생각보다 사람도 많고 체험할 거리도 풍성해서 정말 즐거운 시간이었어요.
특히 직접 딸기를 따서 바로 먹어보는 체험이 가장 기억에 남네요. 딸기가 정말 달고 싱싱해요!

점심으로는 근처 유명한 막국수집에 갔는데 웨이팅은 좀 있었지만 맛은 보장합니다.
주차 공간이 협소하니 가급적 일찍 가시는 걸 추천드려요.

다음에 또 기회가 된다면 다시 방문하고 싶네요. 
축제 정보 공유해주신 분들 모두 감사합니다!`,
    images: ['https://picsum.photos/seed/post1/1200/800']
  };

  const [comments, setComments] = useState([
    { 
      id: 1, 
      author: '축제매니아', 
      content: '오 저도 이번 주에 가려고 했는데 정보 감사합니다! 막국수집 위치 좀 더 자세히 알 수 있을까요?', 
      date: '2시간 전', 
      likes: 3,
      replies: [
        { id: 101, author: '축제요정', content: '양평역 근처에 있는 곳이에요! 지도에서 금방 찾으실 수 있을 거예요 ㅎㅎ', date: '1시간 전' }
      ]
    },
    { id: 2, author: '딸기좋아', content: '딸기 체험 비용은 얼마였나요?', date: '30분 전', likes: 0, replies: [] },
  ]);

  const currentUserId = 'user123'; // Mock current user

  return (
    <div className="min-h-screen bg-gray-50/30 font-['Pretendard'] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-purple-600 font-black transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            목록으로
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-3 rounded-2xl border transition-all active:scale-95 ${
                isBookmarked 
                ? 'bg-purple-50 border-purple-100 text-purple-600' 
                : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 rounded-2xl transition-all active:scale-95">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Post Content Area */}
        <article className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
          
          {/* Post Header */}
          <div className="p-8 md:p-12 border-b border-gray-50 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-purple-100">
                {post.category}
              </span>
              <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                {post.date}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8 tracking-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-md">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt={post.author} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-gray-900 text-lg">{post.author}</p>
                    <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded">LV.15</span>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Community Member</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-gray-400 font-bold">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest mb-1 opacity-60">Views</span>
                  <span className="text-gray-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-gray-300" /> {post.views}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest mb-1 opacity-60 text-rose-500">Likes</span>
                  <span className="text-rose-500 flex items-center gap-1.5 font-black">
                    <Heart className="w-4 h-4 fill-current" /> {post.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="p-8 md:p-12">
            <div className="prose prose-purple max-w-none text-gray-800 leading-relaxed font-medium text-lg whitespace-pre-wrap mb-12">
              {post.content}
            </div>

            {post.images.map((img, i) => (
              <div key={i} className="rounded-[2.5rem] overflow-hidden border border-gray-100 mb-8 shadow-lg shadow-gray-100">
                <img src={img} alt="Post content" className="w-full h-auto hover:scale-105 transition-transform duration-700" />
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-6 mt-16 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-lg transition-all active:scale-95 ${
                    isLiked 
                    ? 'bg-rose-500 text-white shadow-xl shadow-rose-200 translate-y-[-2px]' 
                    : 'bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-500 border border-transparent hover:border-rose-100'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  추천 {post.likes + (isLiked ? 1 : 0)}
                </button>
              </div>

              <div className="flex items-center gap-4">
                {currentUserId === post.authorId && (
                  <>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-500 hover:text-purple-600 font-black text-sm rounded-2xl border border-gray-100 hover:border-purple-100 transition-all">
                      <Edit3 className="w-4 h-4" /> 수정
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-500 hover:text-rose-500 font-black text-sm rounded-2xl border border-gray-100 hover:border-rose-100 transition-all">
                      <Trash2 className="w-4 h-4" /> 삭제
                    </button>
                  </>
                )}
                <button className="p-3 text-gray-300 hover:text-gray-500 transition-colors">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Comment Section */}
        <section className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-purple-600" />
              <h3 className="text-2xl font-black text-gray-900">댓글 <span className="text-purple-600 ml-1">{comments.length}</span></h3>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* Comment Input */}
            <div className="flex gap-5 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser`} alt="Current User" />
              </div>
              <div className="flex-grow relative">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="따뜻하고 고운 말을 사용해주세요."
                  className="w-full bg-gray-50/80 border-2 border-transparent rounded-[2rem] p-6 text-base min-h-[120px] focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 outline-none resize-none transition-all font-medium"
                />
                <button 
                  className="absolute bottom-4 right-4 bg-purple-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 shadow-lg shadow-purple-100"
                  disabled={!commentText.trim()}
                >
                  등록하기
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Comment List */}
            <div className="space-y-10">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-6">
                  <div className="flex gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} alt={comment.author} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-gray-900">{comment.author}</span>
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{comment.date}</span>
                        </div>
                        <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-700 mb-4 font-medium leading-relaxed">{comment.content}</p>
                      <div className="flex items-center gap-5">
                        <button className="text-[11px] font-black text-gray-400 hover:text-purple-600 transition-all uppercase tracking-widest flex items-center gap-1.5">
                          답글달기
                        </button>
                        <button className="flex items-center gap-1.5 text-[11px] font-black text-gray-400 hover:text-rose-500 transition-all uppercase tracking-widest">
                          <Heart className={`w-3.5 h-3.5 ${comment.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} /> {comment.likes}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-16 space-y-8 border-l-4 border-purple-50 pl-8 mt-6">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-4 group/reply">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 transition-transform group-hover/reply:scale-105">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author}`} alt={reply.author} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className="font-black text-sm text-gray-900">{reply.author}</span>
                              <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{reply.date}</span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetailPage;
