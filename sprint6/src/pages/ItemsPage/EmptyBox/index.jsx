import './index.css';

const EmptyBox = ({ run }) => {

  if (run) {
    return (
      <div id='emptyPrdsBox'>
        <div className="emptyContentBox">
          검색하신 상품이 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div className="none">
      <div className="emptyContentBox">
        검색하신 상품이 없습니다.
      </div>
    </div>
  )
}

export default EmptyBox;