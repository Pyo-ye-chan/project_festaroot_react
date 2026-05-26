function MapCategoryTab() {
  const tabs = ['전체', '음식점', '관광지', '축제/행사'];
  return (
    <div style={styles.tabContainer}>
      {tabs.map((tab, idx) => (
        <button key={idx} style={idx === 0 ? styles.activeTab : styles.tab}>
          {tab}
        </button>
      ))}
    </div>
  );
}

const styles = {
  tabContainer: { position: 'absolute', top: '16px', left: '16px', zIndex: 10, display: 'flex', gap: '8px' },
  tab: { padding: '8px 16px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#64748B', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  activeTab: { padding: '8px 16px', backgroundColor: '#6366F1', border: '1px solid #6366F1', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#FFF', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
};

export default MapCategoryTab;