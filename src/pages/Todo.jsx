import {
  Button,
  // Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash } from "tabler-icons-react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import styles from "./Todo.module.css";

export function Todo() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");

  function createTask() {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
    };
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className={styles.container}>
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            centered
          >
            <div className={styles.modalContent}>
              <TextInput
                className={styles.modalInput}
                ref={taskTitle}
                placeholder={"Task Title"}
                required
                label={"Title"}
              />
              <TextInput
                className={styles.modalInput}
                ref={taskSummary}
                placeholder={"Task Summary"}
                label={"Summary"}
              />
              <Group className={styles.modalActions}>
                <Button onClick={() => setOpened(false)} variant={"subtle"}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    createTask();
                    setOpened(false);
                  }}
                >
                  Create Task
                </Button>
              </Group>
            </div>
          </Modal>
          <div className={styles.header}>
            <Title className={styles.title}>My Tasks</Title>
            <ActionIcon
              color={"blue"}
              onClick={() => toggleColorScheme()}
              size="lg"
            >
              {colorScheme === "dark" ? (
                <Sun size={16} />
              ) : (
                <MoonStars size={16} />
              )}
            </ActionIcon>
          </div>
          {tasks.length > 0 ? (
            tasks.map((task, index) => {
              if (task.title) {
                return (
                  <Card key={index} className={styles.taskCard}>
                    <div className={styles.taskHeader}>
                      <Text className={styles.taskTitle}>{task.title}</Text>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </div>
                    <Text className={styles.taskSummary}>
                      {task.summary
                        ? task.summary
                        : "No summary was provided for this task"}
                    </Text>
                  </Card>
                );
              }
              return null;
            })
          ) : (
            <Text className={styles.noTasks}>You have no tasks</Text>
          )}
          <Button
            className={styles.newTaskButton}
            onClick={() => setOpened(true)}
          >
            New Task
          </Button>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
