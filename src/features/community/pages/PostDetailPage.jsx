import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Share2,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  Send,
  User,
  Trash2,
  Edit3,
  Download // Added for attachments
} from 'lucide-react';
import { getPostDetail, updatePost, deletePost } from '../../../api/boardApi';
import useAuthStore from '../../../store/useAuthStore';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [post, setPost] = useState(null); // 게시글 상세 정보 상태
  const [attachments, setAttachments] = useState([]); // 첨부파일 상태
  const [deleteFileIds, setDeleteFileIds] = useState([]); // 삭제할 기존 첨부파일 ID 목록


  useEffect(() => {

    const fetchPostDetail = async () => {
      try {
        const postDetail = await getPostDetail(id);
        console.log('Fetched post detail:', postDetail.data);
        setPost(postDetail.data.dto);
        setAttachments(postDetail.data.list || []);


      } catch (error) {
        console.error('Error fetching post detail:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: '축제매니아',
      content: '오 저도 이번 주에 가려고 했는데 정보 감사합니다!',
      date: '2시간 전',
      likes: 3,
      replies: [
        { id: 101, author: '축제요정', content: '꼭 가보세요! 후회 안 하실 거예요 ㅎㅎ', date: '1시간 전' }
      ]
    },
    { id: 2, author: '딸기좋아', content: '막국수집 이름 좀 알 수 있을까요?', date: '30분 전', likes: 0, replies: [] },
  ]);

  const currentUserId = useAuthStore((state) => state.user?.member_id);

  const handleDeletePost = async () => {


    if (window.confirm('정말로 게시글을 삭제하시겠습니까?')) {
      try {
        await deletePost(id);
        alert('게시글이 성공적으로 삭제되었습니다.');
        navigate('/community/board/all'); // Redirect to board list after deletion
      } catch (error) {
        console.error('게시글 삭제 실패:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };
  useEffect(() => {
    console.log("attachments", attachments);
  }, [attachments]);

  const getCategoryClasses = (postCategory) => {
    switch (postCategory) {
      case '후기':
        return 'bg-[var(--festival-yellow)] text-gray-800';
      case '팁':
        return 'bg-[var(--festival-purple-soft)] text-white';
      case '정보':
        return 'bg-gray-300 text-gray-800';
      case '자유':
        return 'bg-gray-500 text-white';
      case '꿀팁': // Specific for '꿀팁공유'
        return 'bg-blue-400 text-white';
      case '공지사항':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const handleDownload = async (file) => {

    try {
      const response = await fetch(file.file_path);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = file.file_name;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert('파일 다운로드 실패');
    }
  };

  const handleDeleteComment = (commentId, isReply = false, parentId = null) => {
    if (isReply) {
      setComments(comments.map(c =>
        c.id === parentId
          ? { ...c, replies: c.replies.filter(r => r.id !== commentId) }
          : c
      ));
    } else {
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  if (!post) {
    return <div>게시글을 불러오는 중입니다.</div>;

  }

  return (


    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-[var(--festival-purple)] font-bold mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          목록으로 돌아가기
        </button>

        {/* Post Content Area */}


        <article className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Post Header */}
          <div className="p-8 md:p-12 border-b border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black ${getCategoryClasses(post.category)}`}>
                {post.category}
              </span>
              <span className="text-xs font-bold text-gray-400">{post.created_at}</span>
            </div>

            <div className="flex justify-between items-start gap-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {post.title}
              </h1>
              <div className="flex-shrink-0">
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-[var(--festival-purple-soft)]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.nickname}`} alt={post.nickname} />
                </div>
                <div>
                  <p className="font-black text-gray-900">{post.nickname}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-400 text-sm font-bold">
                <span className="flex items-center gap-1.5">조회 {post.view_count}</span>
                <span className="flex items-center gap-1.5 text-rose-500">좋아요 {post.like_count}</span>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="p-8 md:p-12">

            <div
              className="
                prose
                prose-lg
                max-w-none
                prose-img:rounded-3xl
                prose-img:max-w-3xl
                prose-img:mx-auto
                prose-img:border
                prose-img:border-gray-100
              "
              dangerouslySetInnerHTML={{
                __html: post.content
              }}
            />



            {attachments.length > 0 && (
              <div className="mt-8 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  첨부파일
                </h3>

                <div className="space-y-2">

                  {attachments.map((file) => (
                    <button
                      key={file.attach_id || file.file_path}
                      type="button"
                      onClick={() => {
                        window.location.href = `http://localhost/storage/download/${file.attach_id}`;
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        bg-gray-50
                        px-4
                        py-3
                        hover:bg-purple-50
                        transition-all
                      ">
                      <span className="text-sm font-bold text-gray-700 truncate">
                        {file.file_name}
                      </span>

                      <span className="flex items-center gap-1 text-xs font-black text-[var(--festival-purple)]">
                        <Download className="w-4 h-4" />
                        다운로드
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all active:scale-95 ${isLiked
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  {post.like_count + (isLiked ? 1 : 0)}
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-2xl font-black transition-all active:scale-95">
                  <Share2 className="w-5 h-5" />
                  공유
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentUserId === post.member_id && (
                  <>
                    <button
                      onClick={() => navigate(`/community/update/${post.post_id}`, { state: { post } })}
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[var(--festival-purple)] font-bold text-sm transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> 수정
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-rose-500 font-bold text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> 삭제
                    </button>
                  </>
                )}
                <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors">
                  <AlertCircle className="w-4 h-4" /> 신고
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Comment Section */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[var(--festival-purple)]" />
            <h3 className="text-xl font-black text-gray-900">댓글 {comments.length}</h3>
          </div>

          <div className="p-8">
            {/* Comment Input */}
            <div className="flex gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser`} alt="" />
              </div>
              <div className="flex-grow relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="따뜻한 댓글을 남겨주세요."
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm min-h-[100px] focus:ring-2 focus:ring-[var(--festival-purple)]/20 outline-none resize-none"
                />
                <button
                  className="absolute bottom-4 right-4 bg-[var(--festival-purple)] text-white p-2.5 rounded-xl hover:bg-[var(--festival-purple-soft)] transition-all active:scale-95 disabled:opacity-50"
                  disabled={!commentText.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Comment List */}
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} alt="" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-gray-900">{comment.author}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{comment.date}</span>
                        </div>
                        <button className="text-gray-300 hover:text-gray-500"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-medium">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="text-[11px] font-black text-gray-400 hover:text-[var(--festival-purple)] transition-colors uppercase tracking-widest">Reply</button>
                        <button className="flex items-center gap-1 text-[11px] font-black text-gray-400 hover:text-rose-500 transition-colors uppercase tracking-widest">
                          <Heart className="w-3 h-3" /> {comment.likes}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-14 space-y-6 border-l-2 border-gray-50 pl-6">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.author}`} alt="" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-black text-xs text-gray-900">{reply.author}</span>
                              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{reply.date}</span>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">{reply.content}</p>
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
