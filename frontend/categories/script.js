

const obj_list = [
    {name: 'Sofas',
    link: '../resources/sofa.glb'},
    {name: 'Beds',
        link: '../resources/bed.glb'},
    {name: 'Armchairs',
        link: '../resources/chair.glb'},
    {name: 'Tables',
        link: '../resources/table.glb'},
    {name: 'Decor',
        link: '../resources/lamp.glb'},
    {name: 'Shelves',
        link: '../resources/shelf.glb'}
];

document.addEventListener("DOMContentLoaded", function () {

    fetch('/categories/categories_lst')
        .then(response => response.json())
        .then(categories => {
            const objectsWrapper = document.querySelector('.objects-wrapper');
            const othersWrapper = document.querySelector('.others-categories');
            let counter = 0;

            categories.forEach(category => {

                const modelData = obj_list.find(item => item.name === category.categories_name);

                if (modelData) {
                    counter++;
                    const objSection = document.createElement('div');
                    objSection.classList.add('obj-section');

                    if (counter % 2 === 0) {
                        objSection.innerHTML = `
                        <div class="model-container" data-model="${modelData.link}"></div>
                        <div class="text-block" id="${category.categories_name}">
                            <h2>${category.categories_name}</h2>
                            <p>${category.categories_description}</p>
                        </div>                        
                    `;
                    }else{
                        objSection.innerHTML = `                        
                        <div class="text-block" id="${category.categories_name}">
                            <h2>${category.categories_name}</h2>
                            <p>${category.categories_description}</p>
                        </div> 
                        <div class="model-container" data-model="${modelData.link}"></div>                       
                    `;
                    }
                       objectsWrapper.appendChild(objSection);
                } else {

                    const section = document.createElement('div');
                    section.classList.add('text-block');
                    section.id = category.categories_name;
                    section.innerHTML = `
                        <h2>${category.categories_name}</h2>
                        <p>${category.categories_description}</p>
                    `;
                    othersWrapper.appendChild(section);
                }
            });
            document.querySelectorAll('.text-block').forEach(category => {
                category.addEventListener('click', event => {
                    const link_name = category.id;
                    window.location.href = `/category/${link_name}`;
                });
            });


            document.querySelectorAll('.model-container').forEach(container => {
                const modelPath = container.dataset.model;
                container.viewer = new ModelViewer(container, modelPath);
            });

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    const container = entry.target;
                    if (container.viewer) {
                        container.viewer.setVisible(entry.isIntersecting);
                    }
                });
            }, {threshold: 0.3 });

            document.querySelectorAll('.model-container').forEach(container => {
                observer.observe(container);
            });
        })
        .catch(error => console.error('Error fetching:', error));
});

class ModelViewer {
    constructor(container, modelPath){
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
        this.camera.position.z = 15;
        this.camera.position.y = 8;
        this.camera.position.x = 0;
        this.camera.rotation.x = -30 * (Math.PI / 180);

        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        //color
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        container.appendChild(this.renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.6);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 20, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);


        this.model = null;
        this.visible = false;

        //add model
        const loader = new THREE.GLTFLoader();
        loader.load(modelPath, gltf => {
            this.model = gltf.scene;
            this.model.scale.set(3, 3, 3);
            this.model.position.set(0, 0, 0);

            this.scene.add(this.model);
        });

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    setVisible(state) {
        this.visible = state;
        if (this.renderer.domElement) {
            this.renderer.domElement.classList.toggle('visible', state);
        }
    }

    onResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (this.model && this.visible) {
            this.model.rotation.y = Math.sin(window.scrollY * 0.005) * 0.6;
            this.model.rotation.x = Math.cos(window.scrollY * 0.005) * 0.6;

        }
        this.renderer.render(this.scene, this.camera);
    }
}

