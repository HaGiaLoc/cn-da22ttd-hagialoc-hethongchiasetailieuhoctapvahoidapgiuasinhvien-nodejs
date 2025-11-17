import ThanhDieuHuong from './user/ThanhDieuHuong'
import ChanTrang from './user/ChanTrang'

export default function BoTri({ children }) {
  return (
    <div className="app">
      <ThanhDieuHuong />
      <main>{children}</main>
      <ChanTrang />
    </div>
  )
}
