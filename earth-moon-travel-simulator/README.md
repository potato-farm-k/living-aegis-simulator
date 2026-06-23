# Earth-Moon True Scale Travel Simulator

지구와 달의 실제 크기 및 거리 비율을 1:1:1로 보여주는 Three.js 기반 3D 시뮬레이터입니다.

## 상태

기존 시뮬레이터입니다. `living-aegis-simulator` 루트 런처에서 이 폴더로 연결합니다.

실행 진입점:

```text
earth-moon-travel-simulator/index.html
```

## 실행

이 폴더에서 정적 서버를 실행합니다.

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다.

## 조작

- 드래그: 시네마틱 카메라 회전
- 스크롤: 확대/축소
- `Space`: 시작/일시정지
- `R`: 초기화
- 우측 관제 패널: 탐사체, 카메라, 타임워프 선택

지구, 달, 중심 거리에는 실제 비율을 적용했습니다. 탐사체와 궤적 두께는 화면에서 식별할 수 있도록 확대 표시됩니다.

## 유지 관리 메모

- 루트 scaffold 작업에서는 기존 기능을 변경하지 않습니다.
- 기존 코드 구조와 실행 파일 경로를 리팩터링하지 않습니다.
