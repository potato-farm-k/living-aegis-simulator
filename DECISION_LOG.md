# 결정 기록

이 문서는 `living-aegis-simulator`의 repository-level 결정을 기록한다.

## 2026-06-23

### simulator 저장소를 메인 게임과 분리

결정: 제작 보조 simulator는 메인 게임 저장소 `living-aegis-origin`과 분리해 `living-aegis-simulator`에서 관리한다.

이유: simulator는 scale, camera, timing, reference 탐색을 돕기 위한 도구이며, 메인 게임 프로젝트를 직접 변경하지 않고도 제작 판단을 보조할 수 있다.

### simulator 저장소를 gameplay 기능 실험과 분리

결정: gameplay 기능 실험은 `living-aegis-prototype`에서 관리하고, `living-aegis-simulator`와 분리한다.

이유: simulator workspace와 gameplay prototype은 목적이 다르므로, 기본적으로 naming, structure, implementation assumption을 공유하지 않는다.

### 루트 페이지를 런처로 사용

결정: 루트 `index.html`은 실제 simulator가 아니라 simulator 목록/런처 페이지이다.

이유: GitHub Pages 진입 화면에서는 사용 가능한 simulator workspace 목록을 먼저 명확하게 보여주는 것이 좋다.

### 각 simulator를 독립적으로 유지

결정: 각 simulator는 root-level 독립 폴더에 두고, 가능한 한 해당 폴더에서 독립 실행 가능하게 관리한다.

이유: 이후 simulator를 추가하더라도 기존 workspace 구조를 바꾸지 않기 위해서이다.

### simulator 폴더명에 순번을 붙이지 않음

결정: simulator 폴더명에는 순번을 붙이지 않는다.

이유: 목적을 설명하는 이름은 simulator가 추가, 삭제, 재정렬되더라도 안정적으로 유지된다.

### build tooling 없이 시작

결정: 정적 HTML, CSS, JavaScript 파일로 시작하고 package manager, server code, API code, database code는 추가하지 않는다.

이유: 초기 scaffold 단계에서는 GitHub Pages로 제공할 수 있고 단순하게 유지하는 것이 좋다.

### 내부 설명 문서는 한국어 중심으로 작성

결정: 내부 설명 문서는 한국어 중심으로 작성한다.

이유: 이 프로젝트는 개인 학습과 반복 참고가 중요하므로, README, simulation index, notes, docs 문서는 한국어로 읽기 쉽게 정리하는 편이 좋다.

세부 원칙:

- 파일명, 폴더명, 코드 식별자, 주요 기술 용어는 영어를 유지한다.
- HTML, CSS, JavaScript 코드와 변수명, 함수명, class 이름, id 이름은 변경하지 않는다.
- `Canvas 2D`, `GitHub Pages`, `JavaScript`, `Three.js`, `HUD`, `prototype`, `simulator`처럼 필요한 기술 용어는 영어 표기를 허용한다.
- GitHub Pages 화면의 프로젝트 제목과 저장소 이름은 영어를 유지할 수 있다.
