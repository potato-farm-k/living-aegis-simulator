# living-aegis-simulator

이 저장소는 Living Aegis Origin 제작을 위한 simulator 모음이다.

이 저장소는 메인 게임이 아니며, gameplay 기능을 직접 실험하는 prototype 저장소도 아니다.

- 메인 게임: `living-aegis-origin`
- 게임 기능 실험: `living-aegis-prototype`
- 제작 보조 simulator 모음: `living-aegis-simulator`

## 런처

루트 `index.html`은 실제 simulator가 아니라 simulator 목록/런처 페이지이다. 현재 등록된 simulator를 보여주고, 각 simulator 폴더로 연결한다.

현재 등록된 simulator:

- `earth-moon-travel-simulator/`

## 로컬 실행

브라우저에서 루트 `index.html`을 열면 simulator 런처를 볼 수 있다.

기존 Earth-Moon simulator를 직접 열려면 다음 파일을 연다.

```text
earth-moon-travel-simulator/index.html
```

이 저장소의 파일은 정적 HTML, CSS, JavaScript로 구성되어 있으며 build step 없이 GitHub Pages에서 동작하도록 관리한다.

## simulator 추가 기준

각 simulator는 repository root에 독립 폴더로 추가한다.

simulator 폴더명에는 순번을 붙이지 않는다. 폴더명은 simulator의 목적을 설명하는 영어 이름으로 정한다.

좋은 예:

```text
earth-moon-travel-simulator
```

피할 예:

```text
simulator-01-earth-moon-travel
```

simulator를 추가할 때는 `SIMULATION_INDEX.md`와 루트 런처를 함께 갱신한다.

## 문서 언어 원칙

내부 설명 문서는 한국어 중심으로 작성한다. 파일명, 폴더명, 코드 식별자, 주요 기술 용어는 영어를 유지한다.
