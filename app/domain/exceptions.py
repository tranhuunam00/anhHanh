"""Domain exceptions for dictation application."""

class DomainException(Exception):
    """Base exception for domain errors."""
    pass

class InvalidVideoIdException(DomainException):
    """Raised when a video ID is invalid or cannot be extracted."""
    pass

class TranscriptNotFoundException(DomainException):
    """Raised when no suitable transcript is found for a video."""
    pass

class ChallengeNotFoundException(DomainException):
    """Raised when a challenge with a given ID/position is not found."""
    pass
