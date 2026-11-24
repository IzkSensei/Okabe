---
title: "What does a train–test split remember?"
description: "A handwritten digit can be new to a model even when the hand that wrote it is familiar. The difference changes what an accuracy score tells us."
date: 2026-10-18
sample: true
lang: en
tags: [Machine learning, Evaluation]
---

Suppose you collect ten examples of each digit from the same person. Their sevens share a crossbar. Their threes lean to the left. Shuffle the individual images, put some in training and some in testing, and the test set still carries that person’s handwriting.

That split answers a reasonable question: can a model recognize another digit from a writer it may have seen? If the real task is to recognize the handwriting of a new person, the split answers a different question from the one you intended.

## Decide what will be new

Write down a single sentence before touching the data: *At prediction time, I expect to see a new writer.* The word after “new” names the unit to hold out. For a different system, that unit might be a factory camera, a sheet of paper, or a day of collection.

Consider two photographs of the same handwritten four. One crop is a little darker. They are two files and one piece of evidence about the writer. If you split filenames independently, one crop can teach the model how to interpret its near duplicate. A more realistic test keeps both crops together.

## Split before augmentation

Keep a small manifest of source images with a stable writer identifier. Split those identifiers, then make training augmentations. Saving a rotated copy beside its parent is fine as long as both carry the same provenance.

```python
from sklearn.model_selection import GroupShuffleSplit

splitter = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=7)
train, test = next(splitter.split(images, labels, groups=writer_ids))

train_writers = {writer_ids[i] for i in train}
test_writers = {writer_ids[i] for i in test}
assert train_writers.isdisjoint(test_writers)
```

Here `test_size` describes the fraction of groups. When some writers contribute many more images than others, count both writers and images in each partition. Check class coverage as well: the splitter does not promise that every digit will occur on both sides.

## Read the mistakes together

For a test set of ten writers, report the number of correct predictions for each writer alongside a pooled score. Twenty mistakes spread evenly across ten people tell a different story from twenty mistakes concentrated in one person’s handwriting.

> A split describes a future use case. Its description belongs next to the score.

There is still a place for an image-level split. For a handwriting tool personalized to its owner, familiarity may be exactly the condition you want to measure. Give the two experiments distinct names, keep their manifests, and let readers see which question each answers.
