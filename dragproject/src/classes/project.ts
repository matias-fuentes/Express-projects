import { titleInput, descriptionInput, peopleInput } from '../app';

export interface ProjectType {
    id: string;
    title: string;
    description: string;
    people: number;
}

/* The class Project it's in charge of creating a new project. */
export class Project {
    description: string;
    id: string;
    people: number;
    title: string;

    constructor(project: ProjectType) {
        const { description, id, people, title } = project;
        this.description = description;
        this.id = id;
        this.people = people;
        this.title = title;

        this.validate();
        this.renderContent();
    }

    private validate(): void {
        const titleLength = this.title.trim().length;
        const descriptionLength = this.description.trim().length;

        if (titleLength === 0 || descriptionLength === 0 || this.people < 1) {
            alert('Please, add valid inputs and try again.');
            throw new Error('Please, add valid inputs and try again.');
        } else {
            /* If there's no error on the validation, then we empty all the fields */
            const inputs: [HTMLInputElement, HTMLInputElement, HTMLInputElement] = [
                titleInput,
                descriptionInput,
                peopleInput,
            ];
            inputs.forEach(input => {
                input.value = '';
            });
        }
    }

    private renderContent(): void {
        const activeProjects = document.getElementById('active-projects')! as HTMLUListElement;
        const projectElement = document.createElement('li');
        projectElement.id = this.id;
        activeProjects.appendChild(projectElement);

        /* Depending on the value of i, we populate the content of the project with one or another element */
        for (let i = 0; i < 3; i++) {
            let projectSubelement: HTMLHeadElement | HTMLParagraphElement;
            switch (i) {
                case 0:
                    projectSubelement = document.createElement('h2');
                    projectSubelement.textContent = this.title;
                    break;
                case 1:
                    projectSubelement = document.createElement('p');
                    if (this.people === 1) {
                        projectSubelement.textContent = `${this.people.toString()} person assigned`;
                    } else {
                        projectSubelement.textContent = `${this.people.toString()} persons assigned`;
                    }
                    break;
                case 2:
                    projectSubelement = document.createElement('h3');
                    projectSubelement.textContent = this.description;
                    break;
            }
            projectElement.appendChild(projectSubelement!);
        }

        this.dragAndDrop(projectElement);
    }

    private dragAndDrop(projectElement: HTMLLIElement): void {
        /* We set the project as a draggable element. */
        projectElement.setAttribute('draggable', 'true');

        /* When the drag starts, we set some attributes on e.dataTransfer so we can transfer some data from
        one element to another */
        projectElement.addEventListener('dragstart', (e: DragEvent) => {
            e.dataTransfer!.setData('text/plain', this.id);
            e.dataTransfer!.effectAllowed = 'move';
        });
    }
}
