# Simulation Notes

## 목적

이 문서는 Living Aegis Origin 제작에 필요한 simulation 관찰 내용과 해석 메모를 모은다.

## 현재 메모

- Earth-Moon scale과 travel reference는 이 문서와 `docs/moon-earth-scale-notes.md`에 정리한다.
- field of view reference는 이 문서와 `docs/field-of-view-notes.md`에 정리한다.
- light delay reference는 이 문서와 `docs/light-delay-notes.md`에 정리한다.

## Lunar View Framing Simulator

`lunar-view-framing-simulator`는 달 표면에서 지구를 바라보는 1인칭 화면 구도를 빠르게 비교하기 위해 추가한 2D Canvas 제작 보조 도구이다.

1차 조정 항목:

- 지구의 화면상 세로 위치
- 달 표면이 화면 하단에서 차지하는 비중
- 지구 확대율

이 simulator는 확정값을 만드는 도구가 아니라, 여러 구도를 비교하고 Living Aegis Origin의 기본 화면 판단을 돕기 위한 참고 도구이다. 실제 천문 좌표, 3D 시점, 광속 지연, 전투/HUD/조준 시스템은 이번 범위에서 다루지 않는다.

### view-offset-mode 2차 개선 후보

`view-offset-mode`는 `lunar-view-framing-simulator`의 다음 개선 후보이다. UI 표시명 후보는 `시야 오프셋 검증 모드`이며, 기본 구도 1차 검증이 끝난 뒤 추가 여부를 판단한다.

목적은 달 표면에서 지구를 바라보는 기본 구도가 제한된 시야 이동을 견딜 수 있는지 확인하는 것이다.

해석 기준:

- 기본 정면 구도에서는 지구가 화면 중앙에 있는 상태를 기준으로 한다.
- 지구가 좌측/우측에 보이는 것은 지구가 움직인 것이 아니라 플레이어 시야 중심이 이동한 결과로 해석한다.
- 시야 좌우 오프셋과 시야 상하 오프셋은 기존 구도 검증의 확장이므로 별도 시뮬레이터로 분리하지 않는다.
- 이 기능은 게임 조작 구현이 아니라 구도 안정성 검증용이다.
- 마우스 조준, 발사, 미사일, 격추, 타겟 락온, 카메라 반동은 프로토타입 영역으로 분리한다.

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

## 열린 질문

- 메인 게임 화면에서 달 표면 기준 지구는 어느 정도 크게 보여야 하는가?
- first-person HUD view에서 달 표면은 어느 정도 남겨 두어야 하는가?
- light delay 개념은 visual feedback이나 simulation reference에 어떻게 반영할 수 있는가?
- 지구 표면 기지와 지구 궤도 공격 위성 중 어느 공격 원천이 Living Aegis Origin의 기본 루프와 난이도에 더 적합한가?
- 달 시점에서 식별 가능한 공격 위성 고도와 화면상 속도감은 어떤 균형을 가져야 하는가?

## 상태

현재는 scaffold 단계이다. 아직 새로운 계산값이나 design decision은 기록하지 않았다.
