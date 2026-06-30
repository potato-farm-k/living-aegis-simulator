# Simulation Index

이 문서는 `living-aegis-simulator`에 등록된 simulator workspace를 추적한다.

이 저장소는 Living Aegis Origin 제작을 위한 simulator 모음이다. 메인 게임은 `living-aegis-origin`에서 관리하고, 게임 기능 실험은 `living-aegis-prototype`에서 관리한다.

루트 `index.html`은 실제 simulator가 아니라 simulator 목록/런처 페이지이다. 각 simulator는 가능한 한 독립 폴더에서 실행 가능하게 관리한다.

## 등록된 simulators

### Lunar Threat Side Profile Simulator

경로: `lunar-threat-side-profile-simulator/`

상태: prototype-07 위협 접근 문제 검토용 side-profile simulator / 후보·검증 중

목적: 위협 접근 흐름을 옆면 단면 구도로 분리해 source, boost, trajectory, Impact Warning Corridor, Lunar Defense Zone / Impact 관계를 검증한다.

진입점: `lunar-threat-side-profile-simulator/index.html`

현재 확인된 구조:

- `lunar-threat-side-profile-simulator/index.html`
- `lunar-threat-side-profile-simulator/style.css`
- `lunar-threat-side-profile-simulator/script.js`
- `lunar-threat-side-profile-simulator/README.md`

확인 질문:

- 위협의 시작점과 boost 단계가 명확히 구분되는가?
- trajectory가 Lunar Defense Zone을 향해 접근하는 흐름으로 읽히는가?
- Impact Warning Corridor가 공간상의 마지막 방어 구간으로 보이는가?
- Visual Contact와 Surface Occluded가 서로 다른 상태로 표현되는가?
- cameraPitch와 verticalFOV 문제를 실제 trajectory 문제와 분리해 볼 수 있는가?

링크: [Lunar Threat Side Profile Simulator](./lunar-threat-side-profile-simulator/)

메모:

- 실제 지구-달 비율이나 정밀 궤도 물리를 사용하지 않는 Canvas 2D 제작 보조 도구이다.
- 결과가 정리되기 전에는 `prototype-07`의 정면 접근 구조나 Three.js 전환을 확정하지 않는다.

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

### Earth-Moon Scale Time Simulator

경로: `earth-moon-scale-time-simulator/`

상태: reference simulator / scale-time sense viewer

목적: 지구-달 실제 크기/거리/이동시간 체감을 단순한 시각화 중심으로 확인한다.

진입점: `earth-moon-scale-time-simulator/index.html`

현재 확인된 구조:

- `earth-moon-scale-time-simulator/index.html`
- `earth-moon-scale-time-simulator/style.css`
- `earth-moon-scale-time-simulator/script.js`
- `earth-moon-scale-time-simulator/README.md`

확인 질문:

- 실제 상대 축척으로 표시한 지구와 달의 크기 차이가 한눈에 보이는가?
- 평균 중심 거리 384,400 km의 빈 공간이 충분히 멀게 느껴지는가?
- 이동체 preset에 따라 실제 이동시간의 차이가 이해되는가?
- time warp로 긴 이동을 어느 정도까지 관찰 가능한 시간으로 압축할 수 있는가?
- 방향 전환과 반복 재생으로 거리감과 속도감을 익힐 수 있는가?

링크: [Earth-Moon Scale Time Simulator](./earth-moon-scale-time-simulator/)

메모:

- 실제 반지름 비율과 평균 중심 거리를 같은 화면 축척으로 표시하는 Canvas 2D reference viewer이다.
- 중력, 가속·감속, 실제 궤도 물리는 계산하지 않고 일정 속도 직선 이동으로 비교한다.
- 기존 `earth-moon-travel-simulator`의 목적과 구현은 그대로 유지한다.
- 전투, 조준, 요격, Impact Warning과 gameplay HUD를 다루지 않는다.

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
