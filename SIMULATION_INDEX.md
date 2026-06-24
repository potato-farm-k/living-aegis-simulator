# Simulation Index

이 문서는 `living-aegis-simulator`에 등록된 simulator workspace를 추적한다.

이 저장소는 Living Aegis Origin 제작을 위한 simulator 모음이다. 메인 게임은 `living-aegis-origin`에서 관리하고, 게임 기능 실험은 `living-aegis-prototype`에서 관리한다.

루트 `index.html`은 실제 simulator가 아니라 simulator 목록/런처 페이지이다. 각 simulator는 가능한 한 독립 폴더에서 실행 가능하게 관리한다.

## 등록된 simulators

### Lunar View Framing Simulator

경로: `lunar-view-framing-simulator/`

상태: 1차 구현

목적: 달 표면에서 지구를 바라보는 1인칭 게임 화면 구도 검증

진입점: `lunar-view-framing-simulator/index.html`

현재 확인된 구조:

- `lunar-view-framing-simulator/index.html`
- `lunar-view-framing-simulator/style.css`
- `lunar-view-framing-simulator/script.js`
- `lunar-view-framing-simulator/README.md`

메모:

- 지구 세로 위치, 달 표면 비중, 지구 확대율을 비교하기 위한 2D Canvas 참고 도구이다.
- 1x / 3x / 5x / 7x / 10x 지구 확대율 preset을 제공한다.
- 후속 개선 후보로 `view-offset-mode`를 둔다.
- `view-offset-mode`의 UI 표시명 후보는 `시야 오프셋 검증 모드`이다.
- `view-offset-mode`는 기본 구도 1차 검증 후, 달 표면에서 지구를 바라보는 기본 구도가 제한된 시야 이동을 견딜 수 있는지 확인하기 위한 다음 개선 후보이다.
- 실제 천문 좌표, 3D 시점, 광속 지연, 전투/HUD/조준 시스템은 구현하지 않는다.
- 공식 게임 화면의 최종 기준값을 확정하지 않는다.

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

## 후보 simulators

### Orbital Attack Source Simulator

경로: `orbital-attack-source-simulator/`

상태: 다음 후보 / 보류 중

목적: 지구 표면 기지와 지구 궤도 공격 위성의 공격 원천, 위성 고도, 속도, 식별성, 발사 타이밍 검토

구현 우선순위: 중간-높음

구현 방식: 2D Canvas 기반 후보

선행 조건:

- `lunar-view-framing-simulator`로 기본 달-지구 화면 구도를 먼저 확인한 뒤 진행한다.

메모:

- 아직 구현하지 않는다.
- 공격 위성 설정은 게임 루프, 난이도, 세계관에 영향을 주므로 구현 전에 추가 검토가 필요하다.
- simulator 폴더명에는 순번을 붙이지 않는다.

## 이후 추가 항목

새 simulator가 생기면 이 문서에 추가한다. 폴더명은 순번 prefix 없이 목적을 설명하는 영어 이름을 사용한다.
