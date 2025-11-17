import AdminSidebar from './AdminSidebar'

export default function BoTriQuanTri({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
