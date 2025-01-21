class Renderer {
    constructor(root) {
        this.root = root;
        this.components = [];
        this.renderCache = [];
    }

    createComponent(templateName, componentName, parent = null) {
        const template = document.querySelector(templateName);

        if (template != null) {
            const clonedContent = template.content.cloneNode(true);

            const component = document.createElement('div');
            component.classList.add(componentName);
            component.appendChild(clonedContent);

            document.querySelector(parent ? parent : this.root).appendChild(component);

            this.components.push({
                name: componentName,
                component: component
            });

            return component;
        }

        return null;
    }

    rerenderComponent(componentName, props) {
        const item = this.components.find(item => item.name == componentName);

        if (item) {
            const domObject = item.component.querySelector(`[prop="${props.propName}"]`);
            DOMService.setUserValue(domObject, props.value);
        }
    }

    setComponentBehaviour(componentName, action, vm) {
        const item = this.components.find(item => item.name == componentName);
        
        if (item) {
            item.component.querySelector(action.name).addEventListener(action.event, (e) => action.action(vm, e));
        }
    }
}

class DOMService {
    static setUserValue(domObject, value) {
        if (domObject.tagName == 'INPUT') {
            domObject.value = value;
        } else {
            domObject.innerHTML = value;
        }
    }
}

class ViewModel {
    constructor(templateName, componentName, model, actions, renderer) {
        this.templateName = templateName;
        this.componentName = componentName;
        this.model = model;
        this.renderCache = this.model.properties;
        this.renderer = renderer;
        this.children = [];

        this.component = this.renderer.createComponent(templateName, this.componentName);

        if (this.component) {
            actions.forEach(item => {
                this.renderer.setComponentBehaviour(componentName, item, this);
            })
        }

        this.renderProperties();
    }

    renderProperties() {
        this.renderCache.forEach(item => {
            this.renderer.rerenderComponent(this.componentName, {
                propName: `${item.propName}`,
                value: item.value
            });
        });

        this.renderCache = [];
    }

    updateProperty(propertyName, action) {
        this.model.setPropertyValue(propertyName, action());
        this.renderCache.push(this.model.getProperty(propertyName));
        this.renderProperties();
    }
}

class Model {
    constructor(properties) {
        this.properties = properties;
    }

    setPropertyValue(propertyName, value) {        
        this.properties = this.properties.map(item => {
            if (item.propName == propertyName) {
                item.value = value;
                item.isRendered = false;
            }
            return item;
        });
    }

    getProperty(propertyName) {
        return this.properties.find(item => item.propName === propertyName);
    }
}
