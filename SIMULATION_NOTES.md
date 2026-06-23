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

## 열린 질문

- 메인 게임 화면에서 달 표면 기준 지구는 어느 정도 크게 보여야 하는가?
- first-person HUD view에서 달 표면은 어느 정도 남겨 두어야 하는가?
- light delay 개념은 visual feedback이나 simulation reference에 어떻게 반영할 수 있는가?

## 상태

현재는 scaffold 단계이다. 아직 새로운 계산값이나 design decision은 기록하지 않았다.
