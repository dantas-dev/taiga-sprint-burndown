export function getDuration(): string {
    try {
      const duration = (document
        .querySelector('.taskboard-header h1 .date')as HTMLElement).innerText;
        
      return duration;
    } catch (error) {
      return 'NOT FOUND';
    }
  }