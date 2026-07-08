# Simulation Notes

## 목적

이 문서는 Living Aegis Origin 제작에 필요한 simulation 관찰 내용과 해석 메모를 모은다.

## 현재 메모

- Earth-Moon scale과 travel reference는 이 문서와 `docs/moon-earth-scale-notes.md`에 정리한다.
- field of view reference는 이 문서와 `docs/field-of-view-notes.md`에 정리한다.
- light delay reference는 이 문서와 `docs/light-delay-notes.md`에 정리한다.

## Earth-Moon Scale Time Simulator

기존 `earth-moon-travel-simulator`는 지표와 수치 정보가 많아 전체 거리감과 속도감을 직관적으로 보기 어렵다. 기존 simulator의 목적과 기능은 유지하고, 이를 직접 개조하지 않는다.

`earth-moon-scale-time-simulator`는 지구-달 실제 크기와 거리, 이동체별 이동시간, time warp, 방향별 반복 실행을 통해 스케일 감각을 익히는 Canvas 2D 기반 reference simulator로 추가한다.

해석 기준:

- 지구와 달의 원반 반지름 및 평균 중심 거리는 같은 화면 축척을 사용한다.
- 작은 달의 원반은 확대하지 않고, halo와 label만 식별 보조로 사용한다.
- 이동시간은 평균 중심 거리 384,400 km를 preset 속도로 나눈 단순 비교값이다.
- 이동체는 일정 속도로 직선 이동하며 실제 임무 궤도, 중력, 가속·감속은 재현하지 않는다.
- 전투, 조준, 요격, Impact Warning 또는 gameplay 판단으로 직접 연결하지 않는다.

## Lunar View Framing Simulator

`lunar-view-framing-simulator`는 달 표면에서 지구를 바라보는 1인칭 화면 구도를 빠르게 비교하기 위해 추가한 2D Canvas 제작 보조 도구이다.

1차 조정 항목:

- 지구의 화면상 세로 위치
- 달 표면이 화면 하단에서 차지하는 비중
- 지구 확대율

이 simulator는 확정값을 만드는 도구가 아니라, 여러 구도를 비교하고 Living Aegis Origin의 기본 화면 판단을 돕기 위한 참고 도구이다. 실제 천문 좌표, 3D 시점, 광속 지연, 전투/HUD/조준 시스템은 이번 범위에서 다루지 않는다.

### 1차 기본 구도 후보값

`lunar-view-framing-simulator` 기준 1차 기본 구도 후보는 다음과 같이 기록한다.

- Earth Scale: 5x 또는 7x
- Earth Vertical Position: 30%
- Lunar Surface Area: 30%

이 값들은 아직 Living Aegis Origin 게임 본체의 공식 확정값이 아니라, simulator 기준의 1차 기본 구도 후보이다. 이후 prototype에서 실제 조준, 미사일 식별, HUD 배치와 함께 다시 검증해야 한다.

해석:

- Earth Scale 5x와 7x는 둘 다 기본 구도 후보로 유지한다.
- Earth Vertical Position 30%는 시야가 약간 변해도 지구가 안정적으로 보일 수 있는 후보값이다.
- Lunar Surface Area 30%는 달 표면 존재감과 하늘/전투 공간 확보 사이의 절충값이다.
- 달 표면 30%는 이후 크레이터, 언덕, 지평선 굴곡 같은 디테일을 표현하기에 적당한 규모로 본다.
- 15x 확대는 기본 구도값이 아니라, 향후 줌 연출 또는 관측 모드 후보로 분리한다.
- 15x 확대는 이번 simulator 구현 대상이 아니다.

### view-offset-mode 2차 개선 후보

`view-offset-mode`는 `lunar-view-framing-simulator`의 다음 개선 후보이다. UI 표시명 후보는 `시야 오프셋 검증 모드`이며, 기본 구도 1차 검증이 끝난 뒤 추가 여부를 판단한다.

목적은 달 표면에서 지구를 바라보는 기본 구도가 제한된 시야 이동을 견딜 수 있는지 확인하는 것이다.

해석 기준:

- 기본 정면 구도에서는 지구가 화면 중앙에 있는 상태를 기준으로 한다.
- 지구가 좌측/우측에 보이는 것은 지구가 움직인 것이 아니라 플레이어 시야 중심이 이동한 결과로 해석한다.
- 시야 좌우 오프셋과 시야 상하 오프셋은 기존 구도 검증의 확장이므로 별도 시뮬레이터로 분리하지 않는다.
- 이 기능은 게임 조작 구현이 아니라 구도 안정성 검증용이다.
- 마우스 조준, 발사, 미사일, 격추, 타겟 락온, 카메라 반동은 프로토타입 영역으로 분리한다.

## Lunar Threat Side Profile Simulator

`prototype-07-threat-origin-types`에서 위협이 정면 하늘에서 플레이어를 향해 돌진하기보다 화면 위쪽에서 아래로 내려와 `Lunar Defense Zone`에 꽂히는 것처럼 보이는 문제가 반복되었다.

정면 prototype을 계속 수정하기 전에 `lunar-threat-side-profile-simulator`에서 다음 접근 흐름을 옆면 단면 구도로 먼저 검증한다.

```text
source → boost → trajectory → Impact Warning Corridor → Lunar Defense Zone / Impact
```

이 simulator는 실제 지구-달 비율이나 정밀 궤도 물리를 재현하지 않는다. 가상 비율을 사용해 위협의 출발점, boost 단계, 주 trajectory, 마지막 방어 구간과 충돌 지점의 관계를 설명하고, camera pitch와 projection 문제를 실제 trajectory 문제와 분리하는 제작 보조 도구이다.

상태 정의:

- `Impact Warning Corridor`: trajectory progress가 지정한 기준 이상인 마지막 방어 구간이다.
- `Surface Occluded`: Player Camera와 Threat Marker 사이의 line of sight가 단순화된 달 표면 ridge에 막힌 상태이다.
- `Visual Contact`: Threat Marker가 Camera View Cone 안에 있고 `Surface Occluded`가 아닌 상태이다.
- `Threat On Screen`: projection marker가 정면 preview의 vertical FOV 안에 표시되는 상태이다. 표시 좌표와 직접 시야 확보 여부는 같은 의미가 아니다.
- `Predicted Contact`: 아직 직접 보이지 않더라도 예측 trajectory 또는 Impact Warning Corridor 기준으로 충돌을 경고할 수 있는 상태이다.

현재는 후보 / 검증 중이다. Impact Warning Corridor 진입 기준, Visual Contact와 Surface Occluded 판정, Lunar Defense Zone과 Impact Point 위치 기준이 정리된 뒤 prototype으로 전달한다.

## Orbital Attack Source Simulator 후보

`orbital-attack-source-simulator`는 지구 표면 기지와 지구 궤도 공격 위성의 공격 원천, 위성 고도, 속도, 식별성, 발사 타이밍을 검토하기 위한 다음 후보 simulator이다.

현재 상태는 다음 후보 / 보류 중이다. `lunar-view-framing-simulator`로 기본 달-지구 화면 구도를 먼저 확인한 뒤, 공격 원천과 위성 표현이 실제 화면 판단에 필요한지 다시 검토한다.

검토 요지:

- 낮은 궤도는 빠르지만 달 시점에서 식별성이 약할 수 있다.
- 높은 궤도는 식별성은 좋지만 실제 속도감은 약할 수 있다.
- 위성 질량은 같은 궤도에서 속도 자체보다 추진력, 기동성, 파괴 연출, 잔해 표현 변수로 쓰는 것이 적절하다.
- 자연 궤도 모드, 타원 공격 궤도 모드, 강제 궤도 모드를 후속 검토 대상으로 둔다.
- 강제 궤도 표현은 "진행 방향 추진 + 지구 방향 구심 보정"으로 설명하는 것이 적절하다.

이 후보는 2D Canvas 기반으로 검토할 수 있지만, 지금 즉시 구현하지 않는다. 공격 위성 설정은 게임 루프, 난이도, 세계관에 직접 영향을 줄 수 있으므로 구현 전에 추가 검토가 필요하다.

## Threat Type Simulation Follow-up Candidates

위협 유형의 상세 분류는 `living-aegis-origin/docs/GDD.md`에서 관리한다. 이 문서에는 Threat Type Draft v0.1을 simulation 관점에서 검토할 때 필요한 질문만 기록하며, 아래 항목만으로 새 simulator 구현을 확정하지 않는다.

### 1. Missile-type Threat — P0

- source 위치에 따른 boost와 trajectory의 시각적 차이를 확인한다.
- 정면 source에서는 접근 경로가 거의 직선으로 보이는지 확인한다.
- source가 위, 아래, 옆으로 어긋나면 boost 이후 trajectory가 달 방향으로 휘어져 보이는지 확인한다.
- 마지막 구간에서 Lunar Defense Zone과 Impact Warning Corridor로 수렴하는지 확인한다.

### 2. Beam/Charge-type Threat — P1 후보

- line of sight 기반 위협 표현이 가능한지 확인한다.
- 발사 전 충전, 조준선, 예측 신호가 플레이어에게 읽히는지 확인한다.
- 줌 또는 관측 모드와 결합할 수 있는지 확인한다.

Beam/Charge-type Threat은 발사 후 빔을 막는 구조가 아니라 발사 전 source 차단을 검토하는 후속 변주이며, 현재 simulator 구현 대상이 아니다.

### 3. Mass/Object-type Threat — P2 후보

- 느린 물체의 낙하감이 자연스럽게 읽히는지 확인한다.
- 달 중력 영향이 시각적으로 자연스럽게 보이는지 확인한다.
- main threat가 아니라 special threat로 사용하는 것이 적절한지 확인한다.

Mass/Object-type Threat은 느리고 무거운 압박을 검토하는 후속 특수 위협이며, 현재 simulator 구현 대상이 아니다.

## 열린 질문

- 메인 게임 화면에서 달 표면 기준 지구는 어느 정도 크게 보여야 하는가?
- first-person HUD view에서 달 표면은 어느 정도 남겨 두어야 하는가?
- light delay 개념은 visual feedback이나 simulation reference에 어떻게 반영할 수 있는가?
- 지구 표면 기지와 지구 궤도 공격 위성 중 어느 공격 원천이 Living Aegis Origin의 기본 루프와 난이도에 더 적합한가?
- 달 시점에서 식별 가능한 공격 위성 고도와 화면상 속도감은 어떤 균형을 가져야 하는가?

## 상태

현재는 scaffold 단계이다. 아직 새로운 계산값이나 design decision은 기록하지 않았다.
