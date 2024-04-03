import Storage from "./Storage";

class CalorieTracker {
	#calorieLimit = 0;
	#totalCalories = 0;
	#meals = [];
	#workouts = [];

	constructor() {
		this.#calorieLimit = Storage.getCalorieLimit();
		this.#totalCalories = Storage.getTotalCalories();
		this.#meals = Storage.getMeals();
		this.#workouts = Storage.getWorkouts();

		this.#displayCaloriesLimit();
		this.#displayCaloriesTotal();
		this.#displayCaloriesConsumed();
		this.#displayCaloriesBurned();
		this.#displayCaloriesRemaining();
		this.#displayCaloriesProgress();

		document.getElementById('limit').value = this.#calorieLimit;
	}

	// Public methods
	addMeal(meal) {
		this.#meals.push(meal);
		this.#totalCalories += meal.calories;
		Storage.updateTotalCalories(this.#totalCalories);
		Storage.saveMeal(meal);
		this.#displayNewItem('meal', meal);
		this.#render();
	}
	addWorkout(workout) {
		this.#workouts.push(workout);
		this.#totalCalories -= workout.calories;
		Storage.updateTotalCalories(this.#totalCalories);
		Storage.saveWorkout(workout);
		this.#displayNewItem('workout', workout);
		this.#render();
	}
	removeMeal(id) {
		const index = this.#meals.findIndex((meal) => meal.id === id);
		if (index != -1) {
			const meal = this.#meals[index];
			this.#totalCalories -= meal.calories;
			Storage.updateTotalCalories(this.#totalCalories);
			this.#meals.splice(index, 1);
			Storage.removeMeal(id);
			this.#render();
		}
	}
	removeWorkout(id) {
		const index = this.#workouts.findIndex((workout) => workout.id === id);
		if (index != -1) {
			const workout = this.#workouts[index];
			this.#totalCalories += workout.calories;
			Storage.updateTotalCalories(this.#totalCalories);
			this.#workouts.splice(index, 1);
			Storage.removeWorkout(id);
			this.#render();
		}
	}
	setLimit(limit) {
		this.#calorieLimit = limit;
		Storage.setCalorieLimit(limit);
		this.#displayCaloriesLimit();
		this.#render();
	}
	reset() {
		this.#totalCalories = 0;
		this.#meals = [];
		this.#workouts = [];
		Storage.clearAll();
		this.#render();
	}
	loadItems() {
		this.#meals.forEach((meal) => this.#displayNewItem('meal', meal));
		this.#workouts.forEach((workout) =>
			this.#displayNewItem('workout', workout),
		);
	}

	// Private methods
	#displayCaloriesTotal() {
		const totalCaloriesEl = document.getElementById('calories-total');
		totalCaloriesEl.innerHTML = this.#totalCalories;
	}
	#displayCaloriesLimit() {
		const calorieLimitEl = document.getElementById('calories-limit');
		calorieLimitEl.innerHTML = this.#calorieLimit;
	}
	#displayCaloriesConsumed() {
		const caloriesConsumedEl = document.getElementById('calories-consumed');
		const consumed = this.#meals.reduce(
			(total, meal) => total + meal.calories,
			0,
		);
		caloriesConsumedEl.innerHTML = consumed;
	}
	#displayCaloriesBurned() {
		const caloriesBurnedEl = document.getElementById('calories-burned');
		const burned = this.#workouts.reduce(
			(total, workout) => total + workout.calories,
			0,
		);
		caloriesBurnedEl.innerHTML = burned;
	}
	#displayCaloriesRemaining() {
		const caloriesRemainingEl = document.getElementById('calories-remaining');
		const progressEl = document.getElementById('calorie-progress');
		const remaining = this.#calorieLimit - this.#totalCalories;
		caloriesRemainingEl.innerHTML = remaining;

		if (remaining < 0) {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				'bg-light',
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add(
				'bg-danger',
			);
			progressEl.classList.remove('bg-success');
			progressEl.classList.add('bg-danger');
		} else {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				'bg-danger',
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
			progressEl.classList.remove('bg-danger');
			progressEl.classList.add('bg-success');
		}
	}
	#displayCaloriesProgress() {
		const progressEl = document.getElementById('calorie-progress');
		const width = Math.min(
			(this.#totalCalories / this.#calorieLimit) * 100,
			100,
		);
		progressEl.style.width = `${width}%`;
	}
	// TODO: Fix card styling to be flexible (bootstrap grid?)
	#displayNewItem(type, item) {
		const itemsEl = document.getElementById(`${type}-items`);
		const itemEl = document.createElement('div');
		itemEl.classList.add('card', 'my-2');
		itemEl.setAttribute('data-id', item.id);
		itemEl.innerHTML = `
		<div class="card-body">
		<div class="d-flex align-items-center justify-content-between">
		  <h4 class="mx-1" style="width: 30%">${item.name}</h4>
		  <div
			class="fs-1 bg-${
				type === 'meal' ? 'primary' : 'secondary'
			} text-white text-center rounded-2 px-2 px-sm-5"
		  >
		  ${item.calories}
		  </div>
		  <button class="delete btn btn-danger btn-sm mx-2">
			<i class="fa-solid fa-xmark"></i>
		  </button>
		</div>
	  </div>
		`;
		itemsEl.appendChild(itemEl);
	}

	#render() {
		this.#displayCaloriesTotal();
		this.#displayCaloriesConsumed();
		this.#displayCaloriesBurned();
		this.#displayCaloriesRemaining();
		this.#displayCaloriesProgress();
	}

	// Private props - getter and setters
	set calorieLimit(limit) {
		this.#calorieLimit = limit;
	}
	get calorieLimit() {
		return this.#calorieLimit;
	}
	get totalCalories() {
		return this.#totalCalories;
	}
	get meals() {
		return this.#meals;
	}
	get workouts() {
		return this.#workouts;
	}
}

export default CalorieTracker;
