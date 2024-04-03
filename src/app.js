import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker';
import { Meal, Workout } from './Item';

import './css/bootstrap.css';
import './css/style.css';

class App {
	#tracker = undefined;

	constructor() {
		this.#tracker = new CalorieTracker();
		this.#loadEventListeners();
		this.#tracker.loadItems();
	}

	#loadEventListeners() {
		document
			.getElementById('meal-form')
			.addEventListener('submit', this.#newItem.bind(this, 'meal'));
		document
			.getElementById('workout-form')
			.addEventListener('submit', this.#newItem.bind(this, 'workout'));
		document
			.getElementById('meal-items')
			.addEventListener('click', this.#removeitem.bind(this, 'meal'));
		document
			.getElementById('workout-items')
			.addEventListener('click', this.#removeitem.bind(this, 'workout'));
		document
			.getElementById('filter-meals')
			.addEventListener('keyup', this.#filterItems.bind(this, 'meal'));
		document
			.getElementById('filter-workouts')
			.addEventListener('keyup', this.#filterItems.bind(this, 'workout'));
		document
			.getElementById('reset')
			.addEventListener('click', this.#reset.bind(this));
		document
			.getElementById('limit-form')
			.addEventListener('submit', this.#setLimit.bind(this));
	}

	#newItem(type, e) {
		e.preventDefault();

		const name = document.getElementById(`${type}-name`);
		const calories = document.getElementById(`${type}-calories`);

		// Validate inputs
		if (name.value === '' || calories.value === '') {
			alert('Please fill in all fields.');
			return;
		}

		if (type === 'meal') {
			const meal = new Meal(name.value, +calories.value);
			this.#tracker.addMeal(meal);
		} else {
			const workout = new Workout(name.value, +calories.value);
			this.#tracker.addWorkout(workout);
		}

		name.value = '';
		calories.value = '';

		const collapse = document.getElementById(`collapse-${type}`);
		Collapse.getInstance(collapse).hide();
	}

	#removeitem(type, e) {
		const deleteButton = e.target.closest('.delete');

		if (deleteButton) {
			if (confirm('Are you sure?')) {
				const id = deleteButton.closest('.card').getAttribute('data-id');

				type === 'meal'
					? this.#tracker.removeMeal(id)
					: this.#tracker.removeWorkout(id);

				deleteButton.closest('.card').remove();
			}
		}
	}

	#filterItems(type, e) {
		const text = e.target.value.toLowerCase();
		document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
			const name = item.firstElementChild.firstElementChild.textContent;

			if (name.toLowerCase().indexOf(text) !== -1) {
				item.style.display = 'block';
			} else {
				item.style.display = 'none';
			}
		});
	}

	#setLimit(e) {
		e.preventDefault();

		const limit = document.getElementById('limit');

		if (limit.value === '' || limit.value == 0) {
			alert('Please enter a calorie limit.');
			return;
		}

		this.#tracker.setLimit(+limit.value);
		limit.value = '';

		const modalEl = document.getElementById('limit-modal');
		const modal = Modal.getInstance(modalEl);
		modal.hide();
	}

	#reset() {
		this.#tracker.reset();
		document.getElementById('meal-items').innerHTML = '';
		document.getElementById('workout-items').innerHTML = '';
		document.getElementById('filter-meals').value = '';
		document.getElementById('filter-workouts').value = '';
	}
}

const app = new App();
