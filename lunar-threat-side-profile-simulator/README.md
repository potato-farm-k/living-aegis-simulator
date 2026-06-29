# Lunar Threat Side Profile Simulator

이 simulator는 실제 지구-달 비율이나 정확한 궤도 물리를 구현하기 위한 도구가 아니라, `prototype-07`에서 반복된 위협 접근 방향 문제를 side-profile view로 분리해 검증하기 위한 제작 보조 도구입니다.

## 목적

정면 prototype에서 위협이 플레이어를 향해 접근하기보다 화면 위쪽에서 아래로 떨어지는 것처럼 보이는 문제를 바로 수정하지 않고, 다음 흐름을 옆면 단면에서 먼저 확인합니다.

```text
source → boost → trajectory → Impact Warning Corridor → Lunar Defense Zone / Impact
```

`cameraPitch`와 `verticalFOV`를 함께 조정해 실제 trajectory 문제와 정면 projection 문제를 분리해 살펴봅니다.

## 실행

브라우저에서 다음 파일을 엽니다.

```text
lunar-threat-side-profile-simulator/index.html
```

## 포함 항목

- Earth Source Area와 Source Point
- Boost Segment와 Main Trajectory
- 이동하는 Threat Marker와 ghost trail
- Impact Warning Corridor
- Lunar Defense Zone과 Impact Point
- Lunar Surface Cross Section과 Local Horizon Line
- Player Camera와 Camera View Cone
- Visual Contact Zone과 Surface Occluded Zone
- 단순화된 Front Projection Preview

## 조정 가능한 파라미터

- `sourceType`: Earth Surface / Orbital / Test Source
- `trajectoryShape`: Straight / Arc / Guided Curve
- `boostDuration`
- `trajectoryCurveAmount`
- `threatSpeed`
- `warningStartProgress`
- `cameraPitch`
- `verticalFOV`
- `defenseZoneRadius`
- `trailLength`

값은 실제 천문 단위가 아니라 구조 비교를 위한 가상 비율과 `sim u` 단위를 사용합니다.

## 반복 발사와 설정 적용 시점

`Auto Repeat`는 기본적으로 켜져 있습니다. 위협이 Impact Point에 도달하면 짧은 대기 후 같은 Canvas에서 다음 위협을 한 발씩 순차 발사합니다. 동시에 여러 위협을 만들거나 wave, 난이도, 점수 시스템으로 확장하지 않습니다.

현재 발사에 실시간 반영되는 설정:

- `cameraPitch`
- `verticalFOV`
- `warningStartProgress`
- `defenseZoneRadius`
- `trailLength`

다음 발사부터 반영되는 설정:

- `sourceType`
- `boostDuration`
- `trajectoryShape`
- `trajectoryCurveAmount`
- `threatSpeed`

다음 발사 설정을 변경하면 상태 패널의 `Pending Next Launch`와 control 강조로 대기 중인 항목을 확인할 수 있습니다. `Restart`는 pending 값을 즉시 적용해 새 발사를 시작하며, `Defaults`는 기본값으로 새 발사를 시작합니다.

검증 조건 영역은 적용 시점에 따라 `Next launch settings`와 `Live adjustments`로 나누고, Canvas 크기를 유지하면서 padding과 간격을 줄여 한 화면에서 더 많은 조건을 비교할 수 있도록 정리했습니다.

## 상태 정의

- `Impact Warning Corridor`: trajectory progress가 `warningStartProgress` 이상인 마지막 방어 구간입니다.
- `Surface Occluded`: Player Camera와 Threat Marker 사이의 line of sight가 단순화된 달 표면 ridge에 막힌 상태입니다.
- `Visual Contact`: Threat Marker가 Camera View Cone 안에 있고 `Surface Occluded`가 아닌 상태입니다.
- `Threat On Screen`: 정면 preview의 vertical FOV 안에 projection marker가 들어온 상태입니다. 지형에 가려져도 marker 좌표 자체는 preview 안에 있을 수 있습니다.
- `Predicted Contact`: 직접 보이지 않지만 Impact Warning Corridor 기준으로 충돌 경고가 가능한 상태입니다.

## 제외 항목

- 실제 지구-달 비율과 정밀 궤도 물리
- Three.js, WebGL, 3D technical spike
- 마우스 조준, 플레이어 발사, 요격 판정
- 점수, 체력, 게임오버, 다중 위협
- 상세 공격 위성 시스템과 게임 난이도 조정
- 완성형 HUD, 사운드, 카메라 흔들림

## PM 검토 질문

- Source Point와 boost 단계가 서로 구분되어 읽히는가?
- trajectory가 Lunar Defense Zone을 향해 수렴하는 흐름으로 보이는가?
- Impact Warning Corridor가 일반 이동 구간과 구분되는 마지막 방어 구간으로 보이는가?
- 경고 시작 progress가 대응 가능한 시점으로 느껴지는가?
- Visual Contact, Surface Occluded, Threat On Screen이 서로 다른 상태로 이해되는가?
- 정면 preview에서 위협이 위에서 떨어지는 것과 정면에서 접근하는 것을 구분할 기준이 충분한가?

## prototype으로 넘길 기준

- Impact Warning Corridor 진입 기준을 `warningStartProgress` 후보값으로 설명할 수 있어야 합니다.
- Visual Contact는 view cone 포함 여부와 surface occlusion 판정을 분리해 설명할 수 있어야 합니다.
- Lunar Defense Zone의 범위와 Impact Point의 위치 기준을 정할 수 있어야 합니다.
- 정면 prototype에서 위협이 "위에서 아래로 떨어지는 것처럼 보이는지" 또는 "정면에서 접근하는 것처럼 보이는지"를 camera pitch, vertical FOV, trajectory 결과로 구분할 참고 기준이 있어야 합니다.
- 위 기준이 정리된 뒤에만 `living-aegis-prototype`의 정면 접근 표현으로 전달합니다.

## 현재 상태

P0 후보 / 검증 중입니다. 이 simulator 결과만으로 `prototype-07`의 정면 접근 구조나 Three.js 전환을 확정하지 않습니다.
