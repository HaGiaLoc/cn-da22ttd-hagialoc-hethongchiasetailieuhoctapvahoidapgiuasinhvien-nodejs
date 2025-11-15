import ThanhDieuHuong from './ThanhDieuHuong'
import ChanTrang from './ChanTrang'

export default function BoTri({ children }) {
  return (
    <div className="app">
      <ThanhDieuHuong />
      <main>{children}</main>
      <ChanTrang />
    </div>
  )
}
