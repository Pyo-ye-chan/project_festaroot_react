import useLoadingStore from "../store/useLoadingStore";

const LoadingSpinner = () => {

    // zustand에 있는 isLoading 상태 가져오기
    const isLoading = useLoadingStore(state => state.isLoading);

    // 로딩 중이 아니면 아무것도 화면에 그리지 않습니다.
    if (!isLoading) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            {/* Tailwind 기본 애니메이션 스피너 */}
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-lg font-bold animate-pulse">
                공공 API에서 축제 데이터를 동기화 중입니다...
            </p>
            <p className="mt-1 text-gray-300 text-sm">잠시만 기다려주세요.</p>
        </div>
    )
}

export default LoadingSpinner;