export const perf = {
  marks: [] as any[],
  mark(name: string) {
    this.marks.push({ name, time: Date.now() });
  },
  measure() {
    // measure time between marks and between first and last mark:
    const firstMark = this.marks[0];
    const lastMark = this.marks[this.marks.length - 1];
    const total = lastMark.time - firstMark.time;
    let previousMark = firstMark;
    const marks = this.marks.map((mark) => {
      const diff = mark.time - previousMark.time;
      previousMark = mark;
      return {
        name: mark.name,
        time: mark.time,
        diff,
      };
    });

    this.marks = [];

    return {
      total,
      marks,
    };
  },
};
