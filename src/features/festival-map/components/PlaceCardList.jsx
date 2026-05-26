function PlaceCardList() {
  // 💡 백엔드 연동 전까지 화면을 채워줄 가짜 더미 데이터
  const mockPlaces = [
    { id: 1, title: "태안 회센터", category: "한식·해산물", rating: 4.6, reviews: 125, distance: "1.2km", tag: "신선한 해산물", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&q=80" },
    { id: 2, title: "꽃지 해물칼국수", category: "한식·해산물", rating: 4.4, reviews: 98, distance: "2.3km", tag: "바다 전망", img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&q=80" },
    { id: 3, title: "안면도 게국지", category: "한식", rating: 4.7, reviews: 156, distance: "3.8km", tag: "게국지 전문", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80" },
    { id: 4, title: "꽃지 해수욕장", category: "자연관광지", rating: 4.8, reviews: 312, distance: "1.8km", tag: "낙조 명소", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.listHeader}>
        <span style={{ fontWeight: '700', color: '#1E293B' }}>추천 장소 리스트</span>
        <select style={styles.sortSelect}><option>거리순</option></select>
      </div>
      <div style={styles.scrollWrapper}>
        {mockPlaces.map((place) => (
          <div key={place.id} style={styles.card}>
            <img src={place.img} alt={place.title} style={styles.cardImg} />
            <div style={styles.cardBody}>
              <h4 style={styles.cardTitle}>{place.title}</h4>
              <p style={styles.cardCategory}>{place.category}</p>
              <p style={styles.cardMeta}>⭐ {place.rating} ({place.reviews}) · {place.distance}</p>
              <span style={styles.tag}>{place.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { height: '320px', backgroundColor: '#FFF', borderTop: '1px solid #E2E8F0', padding: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
  listHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' },
  sortSelect: { border: '1px solid #CBD5E1', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', color: '#64748B' },
  scrollWrapper: { display: 'flex', gap: '14px', overflowX: 'auto', flex: 1, paddingBottom: '8px' },
  card: { minWidth: '220px', maxWidth: '220px', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#FFF' },
  cardImg: { width: '100%', height: '120px', objectFit: 'cover' },
  cardBody: { padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  cardTitle: { margin: 0, fontSize: '14px', fontWeight: '700', color: '#1E293B' },
  cardCategory: { margin: 0, fontSize: '11px', color: '#94A3B8' },
  cardMeta: { margin: 0, fontSize: '12px', color: '#64748B', fontWeight: '500' },
  tag: { alignSelf: 'flex-start', marginTop: 'auto', padding: '2px 6px', backgroundColor: '#F1F5F9', color: '#64748B', borderRadius: '4px', fontSize: '11px' }
};

export default PlaceCardList;