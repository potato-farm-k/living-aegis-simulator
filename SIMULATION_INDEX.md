# Simulation Index

이 문서는 `living-aegis-simulator`에 등록된 simulator workspace를 추적한다.

이 저장소는 Living Aegis Origin 제작을 위한 simulator 모음이다. 메인 게임은 `living-aegis-origin`에서 관리하고, 게임 기능 실험은 `living-aegis-prototype`에서 관리한다.

루트 `index.html`은 실제 simulator가 아니라 simulator 목록/런처 페이지이다. 각 simulator는 가능한 한 독립 폴더에서 실행 가능하게 관리한다.

## 등록된 simulators

### Earth-Moon Travel Simulator

경로: `earth-moon-travel-simulator/`

상태: 루트 런처에서 연결된 기존 simulator

목적: Earth-Moon travel, distance, scale reference를 확인하기 위한 simulation workspace

진입점: `earth-moon-travel-simulator/index.html`

현재 확인된 구조:

- `earth-moon-travel-simulator/index.html`
- `earth-moon-travel-simulator/README.md`

메모:

- repository scaffold 작업 중에는 기존 simulator 동작을 보존한다.
- 진입 파일명을 바꾸거나 simulator 구조를 리팩터링하지 않는다.
- 현재 simulator는 CSS와 JavaScript를 `index.html` 내부에 포함한다.
- simulator 폴더명에는 순번을 붙이지 않는다.

## 이후 추가 항목

새 simulator가 생기면 이 문서에 추가한다. 폴더명은 순번 prefix 없이 목적을 설명하는 영어 이름을 사용한다.
