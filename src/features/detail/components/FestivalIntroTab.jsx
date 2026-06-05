import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import noImage from '../../../assets/no-image.png';

const FestivalIntroTab = ({ festival, imageUrl, festivalImages }) => {
  const [imagePage, setImagePage] = useState(0);

  const fallbackImage = noImage;

  const displayImages =
    festivalImages.length > 0
      ? festivalImages.map((img) => ({
          url: img.originimgurl || img.smallimageurl,
          name: img.imgname || festival.title,
          serialnum: img.serialnum,
        }))
      : [
          imageUrl && {
            url: imageUrl,
            name: festival.title,
          },
          festival.first_image2 && {
            url: festival.first_image2,
            name: festival.title,
          },
        ].filter(Boolean);

  const finalImages =
    displayImages.length > 0
      ? displayImages
      : [
          {
            url: fallbackImage,
            name: '이미지 준비중',
          },
        ];

  const imagesPerPage = 2;
  const maxImagePage = Math.ceil(finalImages.length / imagesPerPage) - 1;

  const currentImages = finalImages.slice(
    imagePage * imagesPerPage,
    imagePage * imagesPerPage + imagesPerPage
  );

  const handlePrevImages = () => {
    setImagePage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextImages = () => {
    setImagePage((prev) => Math.min(prev + 1, maxImagePage));
  };

  return (
    <div>
      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-purple-600 rounded-full" />
        축제 소개
      </h3>

      <p className="text-gray-600 font-medium leading-relaxed text-lg mb-10 whitespace-pre-line">
        {festival.overview || '소개 정보가 없습니다.'}
      </p>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentImages.map((img, index) => (
            <img
              key={img.serialnum || `${img.url}-${index}`}
              src={img.url}
              alt={img.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              className="rounded-3xl border border-gray-100 w-full h-64 object-cover"
            />
          ))}
        </div>

        {finalImages.length > 2 && (
          <>
            <button
              type="button"
              onClick={handlePrevImages}
              disabled={imagePage === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
              type="button"
              onClick={handleNextImages}
              disabled={imagePage === maxImagePage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md border border-gray-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: maxImagePage + 1 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setImagePage(index)}
                  className={`w-2.5 h-2.5 rounded-full ${
                    imagePage === index ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FestivalIntroTab;