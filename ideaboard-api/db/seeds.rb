4.times do |index|
  Idea.create(title: "Title #{index + 1}", body: "Body #{index + 1}")
end
