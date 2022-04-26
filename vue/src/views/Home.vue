<template>
  <AddTask
    v-if="showAddTask"
    @add-task="addTask"
    @update-task="updateTask"
    :isEdit="isEdit"
    :selectedTask="selectedTask"
  />
  <Tasks
    @toggle-reminder="toggleReminder"
    @delete-task="deleteTask"
    @edit-task="editTask"
    :tasks="tasks"
  />
</template>

<script>
import Tasks from "../components/Tasks";
import AddTask from "../components/AddTask";
export default {
  name: "Home",
  props: {
    showAddTask: Boolean,
  },
  components: {
    Tasks,
    AddTask,
  },
  data() {
    return {
      tasks: [],
      isEdit: false,
    };
  },
  methods: {
    async addTask(task) {
      this.isEdit = false;
      this.selectedTask = {};
      const res = await fetch("api/tasks", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      this.tasks = [...this.tasks, data];
      this.$emit("show-task", false);
    },
    async deleteTask(id) {
      if (confirm("Are you sure?")) {
        const res = await fetch(`api/tasks/${id}`, {
          method: "DELETE",
        });

        res.status === 200
          ? (this.tasks = this.tasks.filter((task) => task.id !== id))
          : alert("Error deleting task");
      }
    },
    async toggleReminder(id) {
      const taskToToggle = await this.fetchTask(id);
      const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

      const res = await fetch(`api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updTask),
      });

      const data = await res.json();

      this.tasks = this.tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      );
    },
    async fetchTasks() {
      const res = await fetch("api/tasks");

      const data = await res.json();

      return data;
    },
    async fetchTask(id) {
      const res = await fetch(`api/tasks/${id}`);

      const data = await res.json();

      return data;
    },
    editTask(id) {
      this.isEdit = true;
      this.$emit("show-task", true);
      const selectedTask = this.tasks.find((t) => t.id === id);
      this.selectedTask = selectedTask;
      console.log("selectedTask", selectedTask);
    },
    async updateTask(updatedTask) {
      console.log("updated", updatedTask);
      const res = await fetch(`api/tasks/${this.selectedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      const data = await res.json();

      this.tasks = this.tasks.map((task) =>
        task.id === this.selectedTask.id
          ? { id: task.id, ...updatedTask }
          : task
      );
      this.$emit("show-task", false);
      this.isEdit = false;
      this.selectedTask = {};
    },
  },
  async created() {
    this.tasks = await this.fetchTasks();
  },
  emits: ["edit-task"],
};
</script>