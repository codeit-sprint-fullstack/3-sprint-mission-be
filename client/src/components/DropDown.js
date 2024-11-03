import { useState, useRef, useEffect } from "react";
import "./DropDown.css";

function Dropdown({ options, selectedOrder, orderChange }) {
  // 드롭다운 열려있는지 상태
  const [isOpen, setIsOpen] = useState(false);
  // 외부 클릭 감지를 위한 ref 사용(기본값 null 랜더링 되면 해당 요소 할당)
  const dropdownRef = useRef(null);
  // 버튼 누르면 열려있는 상태이면 닫고 아니면 반대로
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 드롭다운 옵션 눌렀을 때 이벤트
  const handleSelect = (option) => {
    // 부모 컴포넌트에 선택값 전달 -> app 컴포넌트의 handleOrderClick 에 option 값 넣기
    orderChange(option);
    // 드롭다운 닫기
    setIsOpen(false);
  };
  // 외부 클릭 시 드롭다운 닫기
  const handleClickOutside = (event) => {
    // 드롭다운이 랜더링 되어있고(숨기지 않으면 기본으로 true)
    // 클릭한 요소가 ref.current에 할당된 요소가 아니면, 즉 바깥이면
    // 매뉴 창 닫기
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    // 매뉴 창이 열려있을 때만 이벤트 리스너 추가
    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    // 닫히면(isOpen=false), 컴포넌트가 제거(언마운트)되면 실행->클린업 함수
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdownButton" onClick={toggleDropdown}>
        {selectedOrder} <span className="arrow">▼</span>
      </button>
      {/* 열린 상태(isOpen = true)이면 보이게 */}
      {isOpen && (
        <div className="dropdownMenu">
          {/* map으로 options = ["최신순", "좋아요순"] 배열 순회+div생성 */}
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdownItem"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
