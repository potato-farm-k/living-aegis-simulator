# Earth-Moon Scale Time Simulator

## 목적

지구와 달의 실제 상대 크기, 평균 거리, 이동체별 이동시간과 time warp에 따른 관찰 시간을 한 화면에서 단순하게 비교하는 Canvas 2D 기반 reference simulator입니다.

이 simulator는 전투, 조준, 요격, Impact Warning 판정을 위한 도구가 아니라, 지구-달 실제 크기/거리/이동시간 체감을 단순하게 확인하기 위한 reference simulator입니다.

## 포함 항목

- 지구와 달의 실제 반지름 비율을 반영한 천체 원반
- 평균 중심 거리 384,400 km를 기준으로 한 Earth-Moon distance path
- 이동체 marker, 진행 경로, 방향 화살표, trail ghost points
- 현재 preset, speed, 방향, time warp와 예상 이동시간을 category별로 묶은 가로형 정보 패널
- Earth/Moon diameter, diameter ratio, warped viewing time을 기본 노출하는 상세 축척 정보
- 우측 control panel의 단일 `Route progress` 표시

천체 원반과 중심 거리는 같은 화면 축척을 사용합니다. 작은 달의 원반은 확대하지 않으며, Earth/Moon halo와 이동체 marker만 화면 식별을 위해 실제 비율보다 크게 표시합니다.

## 제외 항목

- 전투, 조준, 발사, 요격 판정
- Impact Warning, Threat State Model, Lunar Defense Zone
- 점수, 체력, 게임오버, 사운드, 완성형 게임 HUD
- 중력, 가속·감속, 정밀 궤도와 같은 실제 천체역학 계산
- 다중 위협 또는 gameplay prototype 기능

## 이동체 preset

- `Light / Laser`: 299,792.458 km/s
- `Near-light Threat`: 광속의 25%
- `Fast Missile`: 20 km/s
- `Slow Projectile`: 2 km/s
- `Crewed Spacecraft`: 11 km/s
- `Custom Speed`: 0.1–299,792.458 km/s 범위의 사용자 입력

모든 이동체는 평균 중심 거리 384,400 km를 일정 속도로 직선 이동하는 비교 모델입니다. 실제 임무 궤도나 가속·감속을 재현하지 않습니다.

## Time warp control

`1×`, `10×`, `100×`, `1,000×`, `10,000×`, `Custom`을 제공합니다. `Custom`은 1–1,000,000× 범위에서 입력할 수 있습니다.

정보 패널의 `Travel time`은 선택 속도 기준의 실제 비교 시간을, `Viewing time`은 현재 time warp로 압축한 관찰 시간을 뜻합니다.

## 반복 실행 옵션

- `Play` / `Pause`: 현재 위치에서 재생하거나 일시정지
- `Reset`: 현재 방향의 시작점으로 이동
- `Loop On` / `Loop Off`: 도착 후 짧게 대기하고 같은 방향과 설정으로 반복
- `Replay from Earth`: `Earth → Moon` 방향을 처음부터 재생
- `Replay from Moon`: `Moon → Earth` 방향을 처음부터 재생
- `Travel direction`: 이동 방향을 별도로 선택

## 구현 방식

외부 라이브러리와 build step이 없는 HTML, CSS, JavaScript 및 Canvas 2D 구현입니다. 3D 공전이나 정밀 궤도 물리 대신, 실제 상대 크기와 평균 중심 거리를 한 축척으로 보여 주는 side view에 집중합니다.

루트 런처 또는 아래 파일을 브라우저에서 직접 열어 실행합니다.

```text
earth-moon-scale-time-simulator/index.html
```

## PM 검토 질문

- 실제 축척의 지구와 달이 같은 화면에서 충분히 구분되는가?
- 두 천체 사이의 빈 공간이 충분히 멀게 느껴지는가?
- 속도 preset을 바꿀 때 실제 이동시간 차이를 쉽게 이해할 수 있는가?
- time warp가 긴 이동을 관찰 가능한 길이로 압축한다는 의미가 명확한가?
- 반복 재생으로 거리감과 속도감을 익힐 수 있는가?
- 가로형 정보 패널이 Earth/Moon 시각화를 가리지 않으면서 category별 수치를 빠르게 비교할 수 있는가?

## 이후 전달 기준

Earth-Moon 실제 축척, 속도별 이동시간, 적절한 time warp 범위에 대한 관찰이 반복 실행으로 안정적으로 설명될 때 다른 simulator 또는 prototype의 참고 기준으로 전달합니다. 이 결과만으로 전투 구조, 실제 궤도 물리, 위협 판정 또는 게임 화면 수치를 확정하지 않습니다.
