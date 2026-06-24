import React, { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronRight,
  Eye,
  Heart,
} from 'lucide-react';
import CommunitySidebar from '../components/CommunitySidebar';
import { getPosts } from '../../../api/boardApi';
import useAuthStore from '../../../store/useAuthStore';

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 5;

const BOARD_CATEGORIES = [
  { id: 'all', label: '전체게시판' },
  { id: 'free', label: '자유게시판' },
  { id: 'review', label: '축제후기' },
  { id: 'tip', label: '꿀팁공유' },
  { id: 'notice', label: '공지사항' },
];

const CATEGORY_NAMES = {
  all: '전체 게시판',
  free: '자유게시판',
  review: '축제후기',
  tip: '꿀팁공유',
  notice: '공지사항',
};

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '후기',
  tip: '꿀팁',
  notice: '공지',

  전체: '전체',
  자유: '자유',
  후기: '후기',
  팁: '꿀팁',
  꿀팁: '꿀팁',
  공지: '공지',
  공지사항: '공지',
};

const CATEGORY_KEY_MAP = {
  all: 'all',
  free: 'free',
  review: 'review',
  tip: 'tip',
  notice: 'notice',

  전체: 'all',
  자유: 'free',
  후기: 'review',
  팁: 'tip',
  꿀팁: 'tip',
  공지: 'notice',
  공지사항: 'notice',
  정보: 'notice',

  전체게시판: 'all',
  자유게시판: 'free',
  축제후기: 'review',
  꿀팁공유: 'tip',
  공지사항: 'notice',
};

const categoryClass = {
  all: 'bg-gray-100 text-gray-600 border-gray-200',
  free: 'bg-slate-100 text-slate-600 border-slate-200',
  review: 'bg-purple-50 text-purple-600 border-purple-100',
  tip: 'bg-amber-50 text-amber-600 border-amber-100',
  notice: 'bg-blue-50 text-blue-600 border-blue-100',
};

const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '조회순', value: 'views' },
  { label: '좋아요순', value: 'likes' },
];

const VALID_SORTS = new Set(SORT_OPTIONS.map(({ value }) => value));
const VALID_SEARCH_TYPES = new Set(['title', 'content', 'author']);

const getCategoryLookupKey = (value) =>
  String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase();

const normalizeCategory = (value, fallback = 'unknown') => {
  const lookupKey = getCategoryLookupKey(value);

  if (!lookupKey) return fallback;

  return CATEGORY_KEY_MAP[lookupKey] || fallback;
};

const getCategoryLabel = (value) => {
  const rawValue = String(value ?? '').trim();
  const normalizedValue = normalizeCategory(rawValue);

  return (
    CATEGORY_LABELS[rawValue] ||
    CATEGORY_LABELS[normalizedValue] ||
    '기타'
  );
};

const getCategoryClasses = (value) => {
  const normalizedValue = normalizeCategory(value);

  return (
    categoryClass[normalizedValue] ||
    'bg-gray-100 text-gray-500 border-gray-200'
  );
};

const getPositivePage = (value) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : 1;
};

const formatDate = (value) => {
  if (!value) return '-';

  return String(value).split('T')[0].replace(/-/g, '.');
};

const toFiniteNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getApiCategory = (value) => {
  const normalizedValue = normalizeCategory(value, 'all');

  return normalizedValue === 'all'
    ? 'all'
    : normalizedValue.toUpperCase();
};

const normalizePost = (post = {}) => ({
  ...post,
  post_id: post.post_id ?? post.postId ?? post.id,
  created_at: post.created_at ?? post.createdAt ?? null,
  view_count: toFiniteNumber(
    post.view_count ?? post.viewCount ?? post.views
  ),
  like_count: toFiniteNumber(
    post.like_count ?? post.likeCount ?? post.likes
  ),
  nickname:
    post.nickname ??
    post.author ??
    post.member_id ??
    post.memberId ??
    '',
});

const BoardListPage = () => {
  const { category: routeCategory = 'all' } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = normalizeCategory(routeCategory, 'all');
  const apiCategory = getApiCategory(activeCategory);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const isLoggedIn = Boolean(user || token);

  const currentPage = getPositivePage(
    searchParams.get('page') ?? searchParams.get('cpage')
  );

  const sortParam =
    searchParams.get('sortBy') ?? searchParams.get('sort') ?? 'latest';
  const sortBy = VALID_SORTS.has(sortParam) ? sortParam : 'latest';

  const searchTypeParam = searchParams.get('searchType') ?? 'title';
  const searchType = VALID_SEARCH_TYPES.has(searchTypeParam)
    ? searchTypeParam
    : 'title';

  const keyword = (searchParams.get('keyword') ?? '').trim();

  const [keywordInput, setKeywordInput] = useState(keyword);
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  const updateListParams = (changes = {}, options = {}) => {
    const nextValues = {
      page: currentPage,
      sortBy,
      searchType,
      keyword,
      ...changes,
    };

    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete('cpage');
    nextParams.delete('sort');

    if (nextValues.page > 1) {
      nextParams.set('page', String(nextValues.page));
    } else {
      nextParams.delete('page');
    }

    if (nextValues.sortBy !== 'latest') {
      nextParams.set('sortBy', nextValues.sortBy);
    } else {
      nextParams.delete('sortBy');
    }

    if (nextValues.searchType !== 'title') {
      nextParams.set('searchType', nextValues.searchType);
    } else {
      nextParams.delete('searchType');
    }

    const trimmedKeyword = String(nextValues.keyword ?? '').trim();

    if (trimmedKeyword) {
      nextParams.set('keyword', trimmedKeyword);
    } else {
      nextParams.delete('keyword');
    }

    setSearchParams(nextParams, options);
  };

  // 메인 화면 검색 등 외부(state)에서 넘어온 검색 키워드 동기화 로직
  useEffect(() => {
    const stateKeyword = location.state?.keyword;
    if (stateKeyword && stateKeyword !== keyword) {
      updateListParams({
        page: 1,
        keyword: stateKeyword,
        searchType: 'title',
      });
    }
  }, [location.state, keyword]);

  useEffect(() => {
    let ignore = false;

    const loadPosts = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await getPosts(
          currentPage,
          apiCategory,
          sortBy,
          searchType,
          keyword
        );

        if (ignore) return;

        const payload = result?.data ?? result ?? {};
        const nextPosts = Array.isArray(payload.list)
          ? payload.list
            .map(normalizePost)
            .filter((post) => post.post_id != null)
          : [];
        const parsedTotalCount = Number(
          payload.totalPostCount ?? payload.totalCount ?? 0
        );
        const nextTotalCount =
          Number.isFinite(parsedTotalCount) && parsedTotalCount >= 0
            ? parsedTotalCount
            : 0;
        const nextTotalPages = Math.max(
          1,
          Math.ceil(nextTotalCount / PAGE_SIZE)
        );

        setTotalCount(nextTotalCount);

        if (currentPage > nextTotalPages) {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.delete('cpage');

          if (nextTotalPages > 1) {
            nextParams.set('page', String(nextTotalPages));
          } else {
            nextParams.delete('page');
          }

          setPosts([]);
          setSearchParams(nextParams, { replace: true });
          return;
        }

        setPosts(nextPosts);
      } catch (error) {
        if (ignore) return;

        console.error('게시글 목록 조회 실패:', error);
        setPosts([]);
        setTotalCount(0);
        setErrorMessage('게시글 목록을 불러오지 못했습니다.');
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [
    currentPage,
    apiCategory,
    sortBy,
    searchType,
    keyword,
    searchParams,
    setSearchParams,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const pageNumbers = useMemo(() => {
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startPage =
      Math.floor((safeCurrentPage - 1) / PAGE_GROUP_SIZE) *
      PAGE_GROUP_SIZE +
      1;
    const endPage = Math.min(
      startPage + PAGE_GROUP_SIZE - 1,
      totalPages
    );

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }, [currentPage, totalPages]);

  const handleSearch = (event) => {
    event.preventDefault();
    updateListParams({ page: 1, keyword: keywordInput });
  };

  const handleSortChange = (nextSortBy) => {
    if (nextSortBy === sortBy) return;
    updateListParams({ page: 1, sortBy: nextSortBy });
  };

  const handleSearchTypeChange = (nextSearchType) => {
    updateListParams({ page: 1, searchType: nextSearchType });
  };

  const handlePageChange = (nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    if (safePage === currentPage) return;
    updateListParams({ page: safePage });
  };

  const getCategoryLink = (categoryId) => {
    const nextParams = new URLSearchParams();

    if (sortBy !== 'latest') nextParams.set('sortBy', sortBy);
    if (searchType !== 'title') nextParams.set('searchType', searchType);
    if (keyword) nextParams.set('keyword', keyword);

    const queryString = nextParams.toString();

    return `/community/board/${categoryId}${queryString ? `?${queryString}` : ''}`;
  };

  const listLocation = `${location.pathname}${location.search}`;

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-4">
                <Link
                  to="/community"
                  className="hover:text-[var(--festival-purple)] transition-colors"
                >
                  커뮤니티
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span>게시판</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--festival-yellow)]" />
                    <span className="text-sm font-black text-[var(--festival-purple)]">
                      FESTA COMMUNITY
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-[var(--dark-gray)]">
                    {CATEGORY_NAMES[activeCategory] || '게시판'}
                  </h2>

                  <p className="mt-3 text-gray-500 font-medium">
                    축제 후기와 여행 팁을 자유롭게 나눠보세요.
                  </p>
                </div>
                {isLoggedIn && (
                  <Link
                    to="/community/write"
                    className="h-12 px-6 bg-[var(--festival-purple)] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[var(--festival-purple-soft)] transition-all shadow-lg shadow-purple-100 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                    글쓰기
                  </Link>
                )}
              </div>
            </div>

            <nav
              className="flex gap-2 mb-6 overflow-x-auto pb-1"
              aria-label="게시판 카테고리"
            >
              {BOARD_CATEGORIES.map((board) => (
                <Link
                  key={board.id}
                  to={getCategoryLink(board.id)}
                  aria-current={activeCategory === board.id ? 'page' : undefined}
                  className={`px-4 py-2.5 rounded-full text-sm font-black transition-all whitespace-nowrap border ${
                    activeCategory === board.id
                      ? 'bg-[var(--festival-yellow)] text-[var(--dark-gray)] border-[var(--festival-yellow)]'
                      : 'bg-white text-gray-500 border-gray-100 hover:text-[var(--festival-purple)] hover:border-purple-100'
                  }`}
                >
                  {board.label}
                </Link>
              ))}
            </nav>

            <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col xl:flex-row gap-3">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row flex-1 gap-3"
                >
                  <select
                    value={searchType}
                    onChange={(event) =>
                      handleSearchTypeChange(event.target.value)
                    }
                    className="h-12 bg-gray-50 rounded-2xl px-4 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20"
                    aria-label="검색 기준"
                  >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="author">작성자</option>
                  </select>

                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={keywordInput}
                      onChange={(event) =>
                        setKeywordInput(event.target.value)
                      }
                      type="search"
                      placeholder="검색어를 입력하세요"
                      className="w-full h-12 bg-gray-50 rounded-2xl pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="h-12 px-6 rounded-2xl bg-[var(--dark-gray)] text-white text-sm font-black hover:bg-black transition-all"
                  >
                    검색
                  </button>
                </form>

                <div className="flex gap-2 overflow-x-auto" aria-label="정렬 방식">
                  {SORT_OPTIONS.map((sort) => (
                    <button
                      key={sort.value}
                      type="button"
                      onClick={() => handleSortChange(sort.value)}
                      aria-pressed={sortBy === sort.value}
                      className={`h-12 px-5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
                        sortBy === sort.value
                          ? 'bg-[var(--festival-purple)] text-white'
                          : 'bg-gray-50 text-gray-500 hover:bg-purple-50 hover:text-[var(--festival-purple)]'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-5">
              <div className="mb-4 flex items-center justify-between px-1">
                <p className="text-sm font-black text-gray-700">
                  게시글{' '}
                  <span className="text-[var(--festival-purple)]">
                    {totalCount.toLocaleString()}
                  </span>
                  개
                </p>
              </div>

              <div className="rounded-3xl border border-gray-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-[90px_1fr_120px_110px_100px] items-center px-5 py-4 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400">
                  <span className="text-center">분류</span>
                  <span className="text-center">제목</span>
                  <span className="text-center">작성자</span>
                  <span className="text-center">작성일</span>
                  <span className="text-center">반응</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {isLoading ? (
                    <div className="p-12 text-center">
                      <p className="text-gray-400 font-bold">
                        게시글을 불러오는 중입니다.
                      </p>
                    </div>
                  ) : errorMessage ? (
                    <div className="p-12 text-center">
                      <p className="text-rose-500 font-bold">
                        {errorMessage}
                      </p>
                    </div>
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <Link
                        key={post.post_id}
                        to={`/community/post/${post.post_id}`}
                        state={{ from: listLocation }}
                        className="grid grid-cols-1 md:grid-cols-[90px_1fr_120px_110px_100px] items-center gap-3 md:gap-0 px-5 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="md:text-center">
                          <span
                            className={`inline-flex border px-3 py-1 rounded-full text-xs font-black ${getCategoryClasses(
                              post.category
                            )}`}
                          >
                            {getCategoryLabel(post.category)}
                          </span>
                        </div>

                        <div className="min-w-0 md:px-4">
                          <h3 className="text-[15px] md:text-base font-extrabold text-gray-800 line-clamp-1 group-hover:text-[var(--festival-purple)] transition-colors">
                            {post.title}
                          </h3>

                          <div className="md:hidden mt-2 flex items-center flex-wrap gap-2 text-xs text-gray-400 font-bold">
                            <span>{post.nickname || '익명'}</span>
                            <span>·</span>
                            <span>{formatDate(post.created_at)}</span>
                            <span>·</span>
                            <span>
                              조회 {(post.view_count ?? 0).toLocaleString()}
                            </span>
                            <span>·</span>
                            <span className="text-rose-500">
                              좋아요 {(post.like_count ?? 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="hidden md:block text-center text-sm font-bold text-gray-500 truncate px-2">
                          {post.nickname || '익명'}
                        </div>

                        <div className="hidden md:block text-center text-sm font-bold text-gray-400">
                          {formatDate(post.created_at)}
                        </div>

                        <div className="hidden md:flex justify-center items-center gap-3 text-xs font-bold text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {(post.view_count ?? 0).toLocaleString()}
                          </span>

                          <span className="flex items-center gap-1 text-rose-500">
                            <Heart className="w-4 h-4" />
                            {(post.like_count ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-gray-400 font-bold">
                        아직 등록된 게시글이 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <nav
                className="pt-6 flex justify-center items-center gap-2"
                aria-label="게시글 페이지 이동"
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                  aria-label="이전 페이지"
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)] hover:bg-purple-50 transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-50 disabled:hover:text-gray-400"
                >
                  ‹
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                      page === currentPage
                        ? 'bg-[var(--festival-purple)] text-white'
                        : 'bg-gray-50 border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)] hover:bg-purple-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                  aria-label="다음 페이지"
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)] hover:bg-purple-50 transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-50 disabled:hover:text-gray-400"
                >
                  ›
                </button>
              </nav>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BoardListPage;
